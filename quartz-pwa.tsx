import { h } from "preact"
import { QuartzEmitterPlugin } from "./quartz/plugins/types"
import { write } from "./quartz/plugins/emitters/helpers"
import { FullSlug } from "./quartz/util/path"

const CACHE_VERSION = "v4"
const APP_ORIGIN = "https://wiki.breast-cancer.workers.dev"

const serviceWorkerSource = `const CACHE = "breast-cancer-wiki-${CACHE_VERSION}";

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/static/icon.png",
  "/static/icon-192.png",
  "/static/apple-touch-icon.png",
  "/index.css",
  "/prescript.js",
  "/postscript.js",
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => undefined)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(event.request);
      const network = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    }),
  );
});

async function getLatestNotification() {
  try {
    const response = await fetch("/api/push/latest", { cache: "no-store" });
    if (response.ok) return await response.json();
  } catch {}

  return {
    title: "유방암 위키",
    body: "새 글이 업데이트되었습니다.",
    url: "/",
    tag: "breast-cancer-wiki-update",
  };
}

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let notification;

      try {
        notification = event.data ? event.data.json() : undefined;
      } catch {}

      notification = notification || (await getLatestNotification());

      await self.registration.showNotification(notification.title || "유방암 위키", {
        body: notification.body || "새 글이 업데이트되었습니다.",
        icon: "/static/icon.png",
        badge: "/static/icon-192.png",
        tag: notification.tag || "breast-cancer-wiki-update",
        data: {
          url: notification.url || "/",
        },
      });
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        if (clientUrl.pathname === targetUrl && "focus" in client) {
          return client.focus();
        }
      }

      return clients.openWindow(targetUrl);
    }),
  );
});
`

const pushRegistrationScript = `
  (function () {
    const buttonId = "pwa-push-subscribe-button";
    const styleId = "pwa-push-subscribe-style";
    const subscriptionStateKey = "breastCancerWikiPushState";
    const buttonSuppressedKey = "breastCancerWikiPushButtonSuppressed";

    function bellIcon() {
      return '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 21a2 2 0 0 0 3.4 0"/><path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/></svg>';
    }

    function renderButton(button, label, state) {
      button.dataset.state = state || "idle";
      button.innerHTML = '<span class="pwa-push-icon">' + bellIcon() + '</span><span>' + label + '</span>';
    }

    function ensureButtonStyle() {
      if (document.getElementById(styleId)) return;

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = \`
        #pwa-push-subscribe-button {
          position: fixed;
          right: 1.25rem;
          bottom: calc(3.25rem + env(safe-area-inset-bottom, 0px));
          z-index: 999;
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          min-height: 2.75rem;
          border: 1px solid rgba(216, 72, 118, 0.2);
          border-radius: 999px;
          padding: 0.68rem 0.95rem 0.68rem 0.72rem;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(250, 248, 248, 0.88)),
            var(--light);
          color: var(--secondary);
          box-shadow: 0 12px 34px rgba(40, 75, 99, 0.18), 0 2px 8px rgba(216, 72, 118, 0.1);
          font: inherit;
          font-size: 0.95rem;
          font-weight: 700;
          line-height: 1;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease;
        }

        #pwa-push-subscribe-button:hover {
          transform: translateY(-2px);
          border-color: rgba(216, 72, 118, 0.36);
          box-shadow: 0 16px 42px rgba(40, 75, 99, 0.22), 0 3px 12px rgba(216, 72, 118, 0.14);
        }

        #pwa-push-subscribe-button:disabled {
          cursor: wait;
          opacity: 0.78;
        }

        #pwa-push-subscribe-button .pwa-push-icon {
          display: inline-grid;
          width: 1.95rem;
          height: 1.95rem;
          place-items: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #e8799d, #84a59d);
          color: white;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);
        }

        #pwa-push-subscribe-button[data-state="success"] .pwa-push-icon {
          background: linear-gradient(135deg, #84a59d, #4b8f8c);
        }

        @media (max-width: 700px) {
          #pwa-push-subscribe-button {
            right: 1rem;
            bottom: calc(4.25rem + env(safe-area-inset-bottom, 0px));
            font-size: 0.9rem;
          }
        }
      \`;
      document.head.appendChild(style);
    }

    function base64UrlToUint8Array(value) {
      const padding = "=".repeat((4 - (value.length % 4)) % 4);
      const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
      const raw = window.atob(base64);
      const output = new Uint8Array(raw.length);

      for (let i = 0; i < raw.length; i++) {
        output[i] = raw.charCodeAt(i);
      }

      return output;
    }

    async function sendSubscription(subscription) {
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
    }

    function markPushEnabled() {
      try {
        localStorage.setItem(subscriptionStateKey, "enabled");
      } catch {}
    }

    function wasPushEnabled() {
      try {
        return localStorage.getItem(subscriptionStateKey) === "enabled";
      } catch {
        return false;
      }
    }

    function suppressButtonForSession() {
      try {
        sessionStorage.setItem(buttonSuppressedKey, "true");
      } catch {}
    }

    function isButtonSuppressed() {
      try {
        return sessionStorage.getItem(buttonSuppressedKey) === "true";
      } catch {
        return false;
      }
    }

    function wait(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    async function subscribeToPush() {
      const keyResponse = await fetch("/api/push/public-key", { cache: "no-store" });
      if (!keyResponse.ok) throw new Error("Push public key is not configured");

      const { publicKey } = await keyResponse.json();
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        await sendSubscription(existingSubscription);
        markPushEnabled();
        return "enabled";
      }

      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return "denied";
      }

      if (Notification.permission !== "granted") return "denied";

      let subscription;
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: base64UrlToUint8Array(publicKey),
        });
      } catch (error) {
        await wait(350);
        subscription =
          (await registration.pushManager.getSubscription()) ||
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64UrlToUint8Array(publicKey),
          }));
      }

      await sendSubscription(subscription);
      markPushEnabled();
      return "enabled";
    }

    async function mountPushButton() {
      if (document.getElementById(buttonId)) return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;
      if (Notification.permission === "denied") return;
      if (isButtonSuppressed()) return;

      if (wasPushEnabled() || Notification.permission === "granted") {
        subscribeToPush().catch(() => {});
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await sendSubscription(existingSubscription).catch(() => {});
        markPushEnabled();
        return;
      }

      ensureButtonStyle();

      const button = document.createElement("button");
      button.id = buttonId;
      button.type = "button";
      button.setAttribute("aria-label", "새 글 알림 받기");
      renderButton(button, "새 글 알림", "idle");

      button.addEventListener("click", async () => {
        suppressButtonForSession();
        button.remove();

        try {
          await subscribeToPush();
        } catch {
          if (Notification.permission === "granted") {
            markPushEnabled();
          }
        }
      });

      document.body.appendChild(button);
    }

    mountPushButton().catch(() => {});
    document.addEventListener("nav", () => mountPushButton().catch(() => {}));
  })();
`

export const PWA: QuartzEmitterPlugin = () => ({
  name: "PWA",
  async *emit(ctx) {
    const { pageTitle, theme } = ctx.cfg.configuration
    const manifest = {
      name: pageTitle,
      short_name: "유방암위키",
      description: "유방암 관련 학습·치료 정보 노트",
      id: `${APP_ORIGIN}/`,
      start_url: `${APP_ORIGIN}/?source=pwa`,
      scope: `${APP_ORIGIN}/`,
      display: "standalone",
      background_color: theme.colors.lightMode.light,
      theme_color: theme.colors.lightMode.secondary,
      lang: "ko-KR",
      categories: ["health", "medical", "education"],
      icons: [
        {
          src: "/static/icon.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "/static/icon-192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    }

    yield write({
      ctx,
      slug: "manifest.webmanifest" as FullSlug,
      ext: "",
      content: JSON.stringify(manifest, null, 2),
    })

    yield write({
      ctx,
      slug: "sw" as FullSlug,
      ext: ".js",
      content: serviceWorkerSource,
    })
  },
  async *partialEmit() {},
  externalResources: () => ({
    additionalHead: [
      h("link", { rel: "manifest", href: "/manifest.webmanifest" }),
      h("meta", { name: "theme-color", content: "#284b63" }),
      h("meta", { name: "apple-mobile-web-app-capable", content: "yes" }),
      h("meta", { name: "apple-mobile-web-app-title", content: "유방암 위키" }),
      h("link", { rel: "apple-touch-icon", href: "/static/apple-touch-icon.png" }),
    ],
    js: [
      {
        loadTime: "afterDOMReady",
        contentType: "inline",
        script: `
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {});
          }
        `,
        spaPreserve: true,
      },
      {
        loadTime: "afterDOMReady",
        contentType: "inline",
        script: pushRegistrationScript,
        spaPreserve: true,
      },
    ],
  }),
})
