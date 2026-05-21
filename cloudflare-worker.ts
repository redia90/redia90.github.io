interface KVListResult {
  keys: { name: string }[]
  list_complete: boolean
  cursor?: string
}

interface KVNamespace {
  get(key: string): Promise<string | null>
  put(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
  list(options?: { prefix?: string; cursor?: string }): Promise<KVListResult>
}

interface StaticAssetsBinding {
  fetch(request: Request): Promise<Response>
}

interface Env {
  ASSETS: StaticAssetsBinding
  PUSH_SUBSCRIPTIONS?: KVNamespace
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

async function listSubscriptionKeys(kv: KVNamespace): Promise<string[]> {
  const keys: string[] = []
  let cursor: string | undefined

  do {
    const result = await kv.list({ prefix: SUBSCRIPTION_PREFIX, cursor })
    keys.push(...result.keys.map((key) => key.name))
    cursor = result.list_complete ? undefined : result.cursor
  } while (cursor)

  return keys
}

async function handleSubscribe(request: Request, env: Env): Promise<Response> {
  if (!env.PUSH_SUBSCRIPTIONS) {
    return jsonResponse({ ok: false, error: "Push storage is not configured" }, { status: 503 })
  }

  const subscription = await readJson<PushSubscriptionJSON>(request)
  if (!validateSubscription(subscription)) {
    return jsonResponse({ ok: false, error: "Invalid push subscription" }, { status: 400 })
  }

  const key = await subscriptionStorageKey(subscription.endpoint)
  await env.PUSH_SUBSCRIPTIONS.put(key, JSON.stringify(subscription))
  return jsonResponse({ ok: true })
}

async function handleUnsubscribe(request: Request, env: Env): Promise<Response> {
  if (!env.PUSH_SUBSCRIPTIONS) {
    return jsonResponse({ ok: false, error: "Push storage is not configured" }, { status: 503 })
  }

  const subscription = await readJson<PushSubscriptionJSON>(request)
  if (typeof subscription?.endpoint !== "string") {
    return jsonResponse({ ok: false, error: "Invalid push subscription" }, { status: 400 })
  }

  await env.PUSH_SUBSCRIPTIONS.delete(await subscriptionStorageKey(subscription.endpoint))
  return jsonResponse({ ok: true })
}

async function handleNotify(request: Request, env: Env): Promise<Response> {
  if (!env.PUSH_SUBSCRIPTIONS) {
    return jsonResponse({ ok: false, error: "Push storage is not configured" }, { status: 503 })
  }

  const token = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "")
  if (!env.PUSH_NOTIFY_SECRET || token !== env.PUSH_NOTIFY_SECRET) {
    return jsonResponse({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  const notification = safeNotificationPayload(
    (await readJson<PushNotificationPayload>(request)) ?? {},
  )
  await env.PUSH_SUBSCRIPTIONS.put(
    LATEST_NOTIFICATION_KEY,
    JSON.stringify({ ...notification, updatedAt: new Date().toISOString() }),
  )

  let sent = 0
  let expired = 0
  let failed = 0

  for (const key of await listSubscriptionKeys(env.PUSH_SUBSCRIPTIONS)) {
    const rawSubscription = await env.PUSH_SUBSCRIPTIONS.get(key)
    if (!rawSubscription) continue

    try {
      const response = await sendPush(env, JSON.parse(rawSubscription) as PushSubscriptionJSON)
      if (response.status === 404 || response.status === 410) {
        expired += 1
        await env.PUSH_SUBSCRIPTIONS.delete(key)
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

async function handleLatest(env: Env): Promise<Response> {
  const rawNotification = await env.PUSH_SUBSCRIPTIONS?.get(LATEST_NOTIFICATION_KEY)
  return jsonResponse(rawNotification ? JSON.parse(rawNotification) : DEFAULT_NOTIFICATION)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === "/api/push/public-key" && request.method === "GET") {
      return env.VAPID_PUBLIC_KEY
        ? jsonResponse({ publicKey: env.VAPID_PUBLIC_KEY })
        : jsonResponse({ ok: false, error: "Push key is not configured" }, { status: 503 })
    }

    if (url.pathname === "/api/push/subscribe" && request.method === "POST") {
      return handleSubscribe(request, env)
    }

    if (url.pathname === "/api/push/unsubscribe" && request.method === "POST") {
      return handleUnsubscribe(request, env)
    }

    if (url.pathname === "/api/push/latest" && request.method === "GET") {
      return handleLatest(env)
    }

    if (url.pathname === "/api/push/notify" && request.method === "POST") {
      return handleNotify(request, env)
    }

    return env.ASSETS.fetch(request)
  },
}
