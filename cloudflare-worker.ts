interface DurableObjectId {}

interface DurableObjectStub {
  fetch(request: Request): Promise<Response>
}

interface DurableObjectNamespace {
  idFromName(name: string): DurableObjectId
  get(id: DurableObjectId): DurableObjectStub
}

interface DurableObjectStorage {
  get<T>(key: string): Promise<T | undefined>
  put<T>(key: string, value: T): Promise<void>
  delete(key: string): Promise<boolean>
  list<T>(options?: { prefix?: string }): Promise<Map<string, T>>
}

interface DurableObjectState {
  storage: DurableObjectStorage
}

interface StaticAssetsBinding {
  fetch(request: Request): Promise<Response>
}

interface Env {
  ASSETS: StaticAssetsBinding
  PUSH_SUBSCRIPTIONS: DurableObjectNamespace
  VAPID_PUBLIC_KEY?: string
  VAPID_PRIVATE_JWK?: string
  PUSH_NOTIFY_SECRET?: string
}

interface PushSubscriptionJSON {
  endpoint?: string
  expirationTime?: number | null
  keys?: {
    p256dh?: string
    auth?: string
  }
}

interface PushNotificationPayload {
  title?: string
  body?: string
  url?: string
  tag?: string
}

const SUBSCRIPTION_PREFIX = "subscription:"
const LATEST_NOTIFICATION_KEY = "latest-notification"
const DEFAULT_NOTIFICATION: Required<PushNotificationPayload> = {
  title: "유방암 위키",
  body: "새 글이 업데이트되었습니다.",
  url: "/",
  tag: "breast-cancer-wiki-update",
}

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers)
  headers.set("Content-Type", "application/json; charset=utf-8")
  headers.set("Cache-Control", "no-store")
  return new Response(JSON.stringify(body), { ...init, headers })
}

function base64Url(input: ArrayBuffer | Uint8Array | string): string {
  const bytes =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : input instanceof Uint8Array
        ? input
        : new Uint8Array(input)

  let binary = ""
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function safeNotificationPayload(
  payload: PushNotificationPayload,
): Required<PushNotificationPayload> {
  const url = typeof payload.url === "string" && payload.url.startsWith("/") ? payload.url : "/"

  return {
    title: payload.title?.trim() || DEFAULT_NOTIFICATION.title,
    body: payload.body?.trim() || DEFAULT_NOTIFICATION.body,
    url,
    tag: payload.tag?.trim() || DEFAULT_NOTIFICATION.tag,
  }
}

async function subscriptionStorageKey(endpoint: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(endpoint))
  return `${SUBSCRIPTION_PREFIX}${base64Url(hash)}`
}

async function readJson<T>(request: Request): Promise<T | undefined> {
  try {
    return (await request.json()) as T
  } catch {
    return undefined
  }
}

function validateSubscription(
  subscription: PushSubscriptionJSON | undefined,
): subscription is PushSubscriptionJSON & {
  endpoint: string
  keys: { p256dh: string; auth: string }
} {
  return (
    typeof subscription?.endpoint === "string" &&
    subscription.endpoint.startsWith("https://") &&
    typeof subscription.keys?.p256dh === "string" &&
    typeof subscription.keys?.auth === "string"
  )
}

async function createVapidJwt(env: Env, audience: string): Promise<string> {
  if (!env.VAPID_PRIVATE_JWK) {
    throw new Error("Missing VAPID_PRIVATE_JWK")
  }

  const privateKey = await crypto.subtle.importKey(
    "jwk",
    JSON.parse(env.VAPID_PRIVATE_JWK) as JsonWebKey,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  )
  const header = base64Url(JSON.stringify({ typ: "JWT", alg: "ES256" }))
  const claims = base64Url(
    JSON.stringify({
      aud: audience,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
      sub: "mailto:admin@breast-cancer.workers.dev",
    }),
  )
  const unsignedToken = `${header}.${claims}`
  const signature = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    new TextEncoder().encode(unsignedToken),
  )

  return `${unsignedToken}.${base64Url(signature)}`
}

async function sendPush(env: Env, subscription: PushSubscriptionJSON): Promise<Response> {
  if (!subscription.endpoint || !env.VAPID_PUBLIC_KEY) {
    throw new Error("Invalid push subscription")
  }

  const audience = new URL(subscription.endpoint).origin
  const jwt = await createVapidJwt(env, audience)

  return fetch(subscription.endpoint, {
    method: "POST",
    headers: {
      Authorization: `vapid t=${jwt}, k=${env.VAPID_PUBLIC_KEY}`,
      TTL: "86400",
      Urgency: "normal",
    },
  })
}

export class PushSubscriptions {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === "/api/push/public-key" && request.method === "GET") {
      return this.env.VAPID_PUBLIC_KEY
        ? jsonResponse({ publicKey: this.env.VAPID_PUBLIC_KEY })
        : jsonResponse({ ok: false, error: "Push key is not configured" }, { status: 503 })
    }

    if (url.pathname === "/api/push/subscribe" && request.method === "POST") {
      return this.handleSubscribe(request)
    }

    if (url.pathname === "/api/push/unsubscribe" && request.method === "POST") {
      return this.handleUnsubscribe(request)
    }

    if (url.pathname === "/api/push/latest" && request.method === "GET") {
      return this.handleLatest()
    }

    if (url.pathname === "/api/push/notify" && request.method === "POST") {
      return this.handleNotify(request)
    }

    return jsonResponse({ ok: false, error: "Not found" }, { status: 404 })
  }

  private async handleSubscribe(request: Request): Promise<Response> {
    const subscription = await readJson<PushSubscriptionJSON>(request)
    if (!validateSubscription(subscription)) {
      return jsonResponse({ ok: false, error: "Invalid push subscription" }, { status: 400 })
    }

    await this.state.storage.put(
      await subscriptionStorageKey(subscription.endpoint),
      JSON.stringify(subscription),
    )
    return jsonResponse({ ok: true })
  }

  private async handleUnsubscribe(request: Request): Promise<Response> {
    const subscription = await readJson<PushSubscriptionJSON>(request)
    if (typeof subscription?.endpoint !== "string") {
      return jsonResponse({ ok: false, error: "Invalid push subscription" }, { status: 400 })
    }

    await this.state.storage.delete(await subscriptionStorageKey(subscription.endpoint))
    return jsonResponse({ ok: true })
  }

  private async handleLatest(): Promise<Response> {
    const notification =
      (await this.state.storage.get<Required<PushNotificationPayload> & { updatedAt?: string }>(
        LATEST_NOTIFICATION_KEY,
      )) ?? DEFAULT_NOTIFICATION

    return jsonResponse(notification)
  }

  private async handleNotify(request: Request): Promise<Response> {
    const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "")
    if (!this.env.PUSH_NOTIFY_SECRET || token !== this.env.PUSH_NOTIFY_SECRET) {
      return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401 })
    }

    const notification = safeNotificationPayload(
      (await readJson<PushNotificationPayload>(request)) ?? {},
    )
    await this.state.storage.put(LATEST_NOTIFICATION_KEY, {
      ...notification,
      updatedAt: new Date().toISOString(),
    })

    let sent = 0
    let expired = 0
    let failed = 0
    const subscriptions = await this.state.storage.list<string>({ prefix: SUBSCRIPTION_PREFIX })

    for (const [key, rawSubscription] of subscriptions) {
      try {
        const response = await sendPush(
          this.env,
          JSON.parse(rawSubscription) as PushSubscriptionJSON,
        )
        if (response.status === 404 || response.status === 410) {
          expired += 1
          await this.state.storage.delete(key)
        } else if (response.ok) {
          sent += 1
        } else {
          failed += 1
        }
      } catch {
        failed += 1
      }
    }

    return jsonResponse({ ok: true, sent, expired, failed })
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname.startsWith("/api/push/")) {
      const id = env.PUSH_SUBSCRIPTIONS.idFromName("global")
      return env.PUSH_SUBSCRIPTIONS.get(id).fetch(request)
    }

    return env.ASSETS.fetch(request)
  },
}
