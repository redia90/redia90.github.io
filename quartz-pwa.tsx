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

    async function subscribeToPush() {
      const keyResponse = await fetch("/api/push/public-key", { cache: "no-store" });
      if (!keyResponse.ok) throw new Error("Push public key is not configured");

      const { publicKey } = await keyResponse.json();
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();

      if (existingSubscription) {
        await sendSubscription(existingSubscription);
        return;
      }

      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;
      }

      if (Notification.permission !== "granted") return;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToUint8Array(publicKey),
      });
      await sendSubscription(subscription);
    }

    async function mountPushButton() {
      if (document.getElementById(buttonId)) return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;
      if (Notification.permission === "denied") return;

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await sendSubscription(existingSubscription).catch(() => {});
        return;
      }

      const button = document.createElement("button");
      button.id = buttonId;
      button.type = "button";
      button.textContent = "새 글 알림";
      button.setAttribute("aria-label", "새 글 알림 받기");
      button.style.position = "fixed";
      button.style.right = "1rem";
      button.style.bottom = "1rem";
      button.style.zIndex = "999";
      button.style.border = "1px solid rgba(40, 75, 99, 0.18)";
      button.style.borderRadius = "999px";
      button.style.padding = "0.65rem 0.9rem";
      button.style.background = "var(--light)";
      button.style.color = "var(--secondary)";
      button.style.boxShadow = "0 6px 24px rgba(0, 0, 0, 0.12)";
      button.style.font = "inherit";
      button.style.fontWeight = "600";
      button.style.cursor = "pointer";

      button.addEventListener("click", async () => {
        button.disabled = true;
        button.textContent = "설정 중";

        try {
          await subscribeToPush();
          button.textContent = Notification.permission === "granted" ? "알림 켜짐" : "알림 차단됨";
          window.setTimeout(() => button.remove(), 1400);
        } catch {
          button.disabled = false;
          button.textContent = "새 글 알림";
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
