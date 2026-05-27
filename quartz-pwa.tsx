import { h } from "preact"
import { QuartzEmitterPlugin } from "./quartz/plugins/types"
import { write } from "./quartz/plugins/emitters/helpers"
import { FullSlug } from "./quartz/util/path"

const CACHE_VERSION = "v9"
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
      try {
        const response = await fetch(event.request);
        if (response.ok) {
          await cache.put(event.request, response.clone());
        }
        return response;
      } catch {
        return cached || Response.error();
      }
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

    function removePushButton() {
      const button = document.getElementById(buttonId);
      if (button) button.remove();
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
      const response = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });
      if (!response.ok) throw new Error("Push subscription could not be saved");
    }

    function markPushEnabled() {
      try {
        localStorage.setItem(subscriptionStateKey, "enabled");
      } catch {}
      suppressButtonForSession();
      removePushButton();
    }

    function wasPushEnabled() {
      try {
        return localStorage.getItem(subscriptionStateKey) === "enabled";
      } catch {
        return false;
      }
    }

    function clearPushEnabled() {
      try {
        localStorage.removeItem(subscriptionStateKey);
      } catch {}
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
        suppressButtonForSession();
        removePushButton();
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
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) return;
      const existingButton = document.getElementById(buttonId);

      if (Notification.permission === "denied") {
        removePushButton();
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        await sendSubscription(existingSubscription).catch(() => {});
        markPushEnabled();
        return;
      }

      if (wasPushEnabled()) {
        clearPushEnabled();
      }

      if (Notification.permission === "granted") {
        try {
          await subscribeToPush();
          return;
        } catch {
          clearPushEnabled();
        }
      }

      if (isButtonSuppressed() && Notification.permission !== "granted") {
        removePushButton();
        return;
      }

      if (existingButton) return;

      ensureButtonStyle();

      const button = document.createElement("button");
      button.id = buttonId;
      button.type = "button";
      button.setAttribute("aria-label", "새 글 알림 받기");
      renderButton(button, Notification.permission === "granted" ? "알림 다시 설정" : "새 글 알림", "idle");

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
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) mountPushButton().catch(() => {});
    });
    window.addEventListener("focus", () => mountPushButton().catch(() => {}));
  })();
`

const installGuideScript = `
  (function () {
    const guideId = "pwa-install-guide";
    const buttonId = "pwa-install-guide-button";
    const styleId = "pwa-install-guide-style";
    const seenKey = "breastCancerWikiInstallGuideSeen";
    let deferredInstallPrompt = null;

    function isInstalled() {
      return (
        window.matchMedia("(display-mode: standalone)").matches ||
        window.matchMedia("(display-mode: fullscreen)").matches ||
        window.navigator.standalone === true
      );
    }

    function detectPlatform() {
      const ua = navigator.userAgent || "";
      const platform = navigator.platform || "";
      const touchMac = platform === "MacIntel" && navigator.maxTouchPoints > 1;

      if (/Android/i.test(ua)) return "android";
      if (/iPhone|iPad|iPod/i.test(ua) || touchMac) return "ios";
      if (/Win/i.test(platform)) return "windows";
      if (/Mac/i.test(platform)) return "mac";
      return "desktop";
    }

    function appIcon() {
      return '<svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>';
    }

    function bellIcon() {
      return '<svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 21a2 2 0 0 0 3.4 0"/><path d="M18 8A6 6 0 0 0 6 8c0 7-3 7-3 9h18c0-2-3-2-3-9"/></svg>';
    }

    function closeIcon() {
      return '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    }

    const copy = {
      ios: {
        label: "iPhone / iPad",
        install: [
          "Safari에서 하단 공유 버튼을 누릅니다.",
          "목록에서 홈 화면에 추가를 선택합니다.",
          "추가를 누르면 홈 화면에서 바로 열 수 있습니다.",
        ],
        notification: [
          "홈 화면에 추가한 앱으로 사이트를 엽니다.",
          "오른쪽 아래 새 글 알림 버튼을 누르고 허용을 선택합니다.",
          "알림이 보이지 않으면 iOS 설정 > 알림에서 유방암 위키 알림을 허용합니다.",
        ],
      },
      android: {
        label: "Android",
        install: [
          "Chrome 또는 Samsung Internet에서 오른쪽 위 메뉴를 엽니다.",
          "앱 설치 또는 홈 화면에 추가를 선택합니다.",
          "설치를 누르면 앱 목록과 홈 화면에서 실행할 수 있습니다.",
        ],
        notification: [
          "설치한 앱 또는 브라우저에서 사이트를 엽니다.",
          "새 글 알림 버튼을 누르고 브라우저 권한 창에서 허용을 선택합니다.",
          "차단했다면 사이트 설정 > 알림에서 허용으로 바꿉니다.",
        ],
      },
      windows: {
        label: "Windows",
        install: [
          "Chrome 또는 Edge 주소창 오른쪽의 설치 아이콘을 누릅니다.",
          "아이콘이 없으면 브라우저 메뉴 > 앱 > 이 사이트를 앱으로 설치를 선택합니다.",
          "설치 후 시작 메뉴나 작업 표시줄에서 실행할 수 있습니다.",
        ],
        notification: [
          "설치한 앱에서 새 글 알림 버튼을 누릅니다.",
          "권한 창에서 허용을 선택합니다.",
          "차단했다면 주소창 자물쇠 아이콘 > 사이트 설정 > 알림을 허용으로 바꿉니다.",
        ],
      },
      mac: {
        label: "Mac",
        install: [
          "Chrome 또는 Edge에서는 주소창 오른쪽 설치 아이콘을 누릅니다.",
          "Safari에서는 공유 버튼 또는 파일 메뉴에서 Dock에 추가를 선택합니다.",
          "설치 후 Dock, Launchpad, Spotlight에서 실행할 수 있습니다.",
        ],
        notification: [
          "설치한 앱에서 새 글 알림 버튼을 누르고 허용을 선택합니다.",
          "Safari를 사용한다면 Safari 설정 > 웹사이트 > 알림에서 허용 상태를 확인합니다.",
          "Chrome 또는 Edge는 주소창 자물쇠 아이콘 > 사이트 설정에서 알림을 허용합니다.",
        ],
      },
      desktop: {
        label: "데스크탑",
        install: [
          "Chrome 또는 Edge 주소창 오른쪽의 설치 아이콘을 누릅니다.",
          "아이콘이 없으면 브라우저 메뉴에서 앱 설치 또는 홈 화면에 추가를 찾습니다.",
          "설치 후 일반 앱처럼 실행할 수 있습니다.",
        ],
        notification: [
          "설치한 앱에서 새 글 알림 버튼을 누릅니다.",
          "권한 창에서 허용을 선택합니다.",
          "차단했다면 브라우저 사이트 설정에서 알림을 허용으로 변경합니다.",
        ],
      },
    };

    function ensureStyle() {
      if (document.getElementById(styleId)) return;

      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = \`
        #pwa-install-guide {
          position: fixed;
          inset: 0;
          z-index: 1200;
          display: grid;
          place-items: center;
          padding: 1rem;
          background: linear-gradient(180deg, rgba(19, 27, 36, 0.42), rgba(19, 27, 36, 0.62));
          backdrop-filter: blur(12px);
        }

        #pwa-install-guide-button {
          position: fixed;
          right: 1.25rem;
          bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
          z-index: 998;
          display: inline-flex;
          align-items: center;
          gap: 0.52rem;
          min-height: 2.55rem;
          border: 1px solid color-mix(in srgb, var(--secondary) 26%, transparent);
          border-radius: 999px;
          padding: 0.58rem 0.86rem 0.58rem 0.64rem;
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--light) 96%, white), color-mix(in srgb, var(--light) 88%, #e8799d)),
            var(--light);
          color: var(--secondary);
          box-shadow: 0 12px 34px rgba(40, 75, 99, 0.16), 0 2px 8px rgba(216, 72, 118, 0.1);
          font: inherit;
          font-size: 0.9rem;
          font-weight: 750;
          line-height: 1;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            border-color 160ms ease;
        }

        #pwa-install-guide-button:hover,
        #pwa-install-guide-button:focus-visible {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--secondary) 44%, transparent);
          box-shadow: 0 16px 42px rgba(40, 75, 99, 0.22), 0 3px 12px rgba(216, 72, 118, 0.14);
          outline: none;
        }

        #pwa-install-guide-button .pwa-install-button-icon {
          display: inline-grid;
          width: 1.75rem;
          height: 1.75rem;
          place-items: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #e8799d, #84a59d);
          color: white;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.42);
        }

        #pwa-install-guide-button .pwa-install-button-tooltip {
          position: absolute;
          right: 0;
          bottom: calc(100% + 0.55rem);
          width: max-content;
          max-width: min(17rem, calc(100vw - 2rem));
          border: 1px solid color-mix(in srgb, var(--secondary) 22%, transparent);
          border-radius: 8px;
          padding: 0.55rem 0.7rem;
          background: var(--light);
          color: var(--dark);
          box-shadow: 0 14px 34px rgba(20, 28, 38, 0.18);
          font-size: 0.82rem;
          font-weight: 700;
          line-height: 1.35;
          white-space: normal;
          pointer-events: none;
        }

        #pwa-install-guide-button .pwa-install-button-tooltip::after {
          content: "";
          position: absolute;
          right: 1.1rem;
          top: 100%;
          width: 0.65rem;
          height: 0.65rem;
          background: var(--light);
          border-right: 1px solid color-mix(in srgb, var(--secondary) 22%, transparent);
          border-bottom: 1px solid color-mix(in srgb, var(--secondary) 22%, transparent);
          transform: translateY(-50%) rotate(45deg);
        }

        #pwa-install-guide .pwa-install-card {
          box-sizing: border-box;
          width: min(46rem, 100%);
          max-height: min(86dvh, 42rem);
          overflow: hidden auto;
          display: grid;
          grid-template-columns: minmax(15rem, 0.9fr) minmax(0, 1.25fr);
          border: 1px solid color-mix(in srgb, var(--lightgray) 64%, transparent);
          border-radius: 8px;
          background: var(--light);
          color: var(--dark);
          box-shadow: 0 26px 80px rgba(20, 28, 38, 0.38), 0 1px 0 rgba(255, 255, 255, 0.56) inset;
          position: relative;
        }

        #pwa-install-guide .pwa-install-card::before {
          content: "";
          position: absolute;
          inset: 0 0 auto;
          height: 3px;
          background: linear-gradient(90deg, #e8799d, #84a59d, #f2cc8f, #284b63);
        }

        #pwa-install-guide .pwa-install-intro {
          min-width: 0;
          display: grid;
          align-content: space-between;
          gap: 1.35rem;
          padding: 1.35rem;
          background:
            linear-gradient(145deg, rgba(232, 121, 157, 0.18), rgba(132, 165, 157, 0.16)),
            color-mix(in srgb, var(--light) 92%, var(--secondary));
          border-right: 1px solid var(--lightgray);
        }

        #pwa-install-guide .pwa-install-app {
          display: grid;
          gap: 0.8rem;
        }

        #pwa-install-guide .pwa-install-app-icon {
          width: 4.35rem;
          height: 4.35rem;
          border-radius: 8px;
          box-shadow: 0 16px 32px rgba(40, 75, 99, 0.18);
        }

        #pwa-install-guide .pwa-install-app-name {
          margin: 0;
          color: var(--dark);
          font-size: 1.22rem;
          font-weight: 900;
          line-height: 1.25;
        }

        #pwa-install-guide .pwa-install-app-copy {
          margin: 0;
          color: var(--darkgray);
          font-size: 0.9rem;
          line-height: 1.55;
        }

        #pwa-install-guide .pwa-install-benefits {
          display: grid;
          gap: 0.55rem;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        #pwa-install-guide .pwa-install-benefits li {
          display: flex;
          align-items: center;
          gap: 0.48rem;
          color: var(--dark);
          font-size: 0.86rem;
          font-weight: 700;
          line-height: 1.35;
        }

        #pwa-install-guide .pwa-install-benefits li::before {
          content: "";
          width: 0.48rem;
          height: 0.48rem;
          border-radius: 999px;
          background: #e8799d;
          box-shadow: 0 0 0 4px rgba(232, 121, 157, 0.12);
          flex: 0 0 auto;
        }

        #pwa-install-guide .pwa-install-main {
          min-width: 0;
          display: grid;
          grid-template-rows: auto 1fr auto;
        }

        #pwa-install-guide .pwa-install-head {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          align-items: start;
          padding: 1.35rem 1.35rem 1rem;
          border-bottom: 1px solid var(--lightgray);
        }

        #pwa-install-guide .pwa-install-mark {
          display: none;
        }

        #pwa-install-guide h2 {
          margin: 0;
          color: var(--dark);
          font-size: 1.25rem;
          line-height: 1.28;
          letter-spacing: 0;
        }

        #pwa-install-guide .pwa-install-subtitle {
          margin: 0.28rem 0 0;
          color: var(--darkgray);
          font-size: 0.9rem;
          line-height: 1.45;
        }

        #pwa-install-guide .pwa-install-platform {
          display: inline-flex;
          align-items: center;
          width: fit-content;
          margin: 0 0 0.5rem;
          border: 1px solid color-mix(in srgb, var(--tertiary) 26%, transparent);
          border-radius: 999px;
          padding: 0.2rem 0.6rem;
          background: color-mix(in srgb, var(--tertiary) 10%, transparent);
          color: var(--tertiary);
          font-size: 0.78rem;
          font-weight: 800;
          line-height: 1.3;
        }

        #pwa-install-guide .pwa-install-close {
          display: grid;
          width: 2.15rem;
          height: 2.15rem;
          place-items: center;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: var(--darkgray);
          cursor: pointer;
        }

        #pwa-install-guide .pwa-install-close:hover {
          background: var(--lightgray);
          color: var(--dark);
        }

        #pwa-install-guide .pwa-install-body {
          display: grid;
          gap: 0;
          padding: 0 1.35rem;
        }

        #pwa-install-guide .pwa-install-section {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.8rem;
          padding: 1rem 0;
          border-bottom: 1px solid color-mix(in srgb, var(--lightgray) 82%, transparent);
        }

        #pwa-install-guide .pwa-install-section-icon {
          display: grid;
          width: 2.15rem;
          height: 2.15rem;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--secondary) 20%, transparent);
          border-radius: 999px;
          background: color-mix(in srgb, var(--secondary) 9%, transparent);
          color: var(--secondary);
        }

        #pwa-install-guide .pwa-install-section-content {
          min-width: 0;
        }

        #pwa-install-guide .pwa-install-section-title {
          margin: 0;
          color: var(--secondary);
          font-size: 0.96rem;
          font-weight: 800;
          line-height: 1.3;
        }

        #pwa-install-guide ol {
          display: grid;
          gap: 0;
          margin: 0.75rem 0 0;
          padding: 0;
          list-style: none;
          counter-reset: pwa-step;
        }

        #pwa-install-guide li {
          counter-increment: pwa-step;
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.6rem;
          align-items: start;
          margin: 0;
          padding: 0.28rem 0;
          color: var(--dark);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        #pwa-install-guide li::before {
          content: counter(pwa-step);
          display: grid;
          width: 1.35rem;
          height: 1.35rem;
          place-items: center;
          border-radius: 999px;
          background: color-mix(in srgb, var(--secondary) 10%, transparent);
          color: var(--secondary);
          font-size: 0.72rem;
          font-weight: 900;
          line-height: 1;
        }

        #pwa-install-guide .pwa-install-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
          align-items: center;
          justify-content: flex-end;
          padding: 1rem 1.35rem 1.35rem;
        }

        #pwa-install-guide .pwa-install-primary,
        #pwa-install-guide .pwa-install-secondary {
          min-height: 2.55rem;
          border-radius: 999px;
          padding: 0 1rem;
          font: inherit;
          font-size: 0.9rem;
          font-weight: 800;
          cursor: pointer;
        }

        #pwa-install-guide .pwa-install-primary {
          border: 1px solid var(--secondary);
          background: linear-gradient(135deg, var(--secondary), color-mix(in srgb, var(--secondary) 72%, #e8799d));
          color: white;
          box-shadow: 0 10px 24px rgba(40, 75, 99, 0.2);
        }

        #pwa-install-guide .pwa-install-secondary {
          border: 1px solid var(--lightgray);
          background: color-mix(in srgb, var(--light) 88%, white);
          color: var(--darkgray);
        }

        #pwa-install-guide .pwa-install-primary:hover,
        #pwa-install-guide .pwa-install-secondary:hover {
          transform: translateY(-1px);
        }

        #pwa-install-guide .pwa-install-primary[hidden] {
          display: none;
        }

        @media (max-width: 700px) {
          #pwa-install-guide-button {
            right: 1rem;
            bottom: calc(0.9rem + env(safe-area-inset-bottom, 0px));
            font-size: 0.86rem;
          }

          #pwa-install-guide-button .pwa-install-button-tooltip {
            right: 0;
            max-width: calc(100vw - 2rem);
          }

          #pwa-install-guide {
            align-items: end;
            padding: 0.7rem;
          }

          #pwa-install-guide .pwa-install-card {
            width: 100%;
            max-height: 86dvh;
            grid-template-columns: minmax(0, 1fr);
          }

          #pwa-install-guide .pwa-install-intro {
            display: none;
          }

          #pwa-install-guide .pwa-install-head {
            padding: 1.05rem 1rem 0.85rem;
          }

          #pwa-install-guide .pwa-install-body {
            padding: 0 1rem;
          }

          #pwa-install-guide .pwa-install-section {
            grid-template-columns: auto 1fr;
            gap: 0.7rem;
            padding: 0.9rem 0;
          }

          #pwa-install-guide .pwa-install-actions {
            justify-content: stretch;
            padding: 0.95rem 1rem 1rem;
          }

          #pwa-install-guide .pwa-install-primary,
          #pwa-install-guide .pwa-install-secondary {
            flex: 1 1 100%;
          }
        }
      \`;
      document.head.appendChild(style);
    }

    function listItems(items) {
      return items.map((item) => "<li>" + item + "</li>").join("");
    }

    function removeGuide() {
      const guide = document.getElementById(guideId);
      if (guide) guide.remove();
    }

    function removeInstallButton() {
      const button = document.getElementById(buttonId);
      if (button) button.remove();
    }

    function hasSeenGuideThisSession() {
      try {
        return sessionStorage.getItem(seenKey) === "true";
      } catch {
        return false;
      }
    }

    function markGuideSeenThisSession() {
      try {
        sessionStorage.setItem(seenKey, "true");
      } catch {}
    }

    function mountInstallButton() {
      if (isInstalled()) {
        removeGuide();
        removeInstallButton();
        return;
      }

      if (hasSeenGuideThisSession()) {
        removeInstallButton();
        return;
      }

      if (document.getElementById(buttonId)) return;
      ensureStyle();

      const button = document.createElement("button");
      button.id = buttonId;
      button.type = "button";
      button.setAttribute("aria-label", "PWA 설치 안내 열기");
      button.title = "클릭해서 설치 방법과 알림 설정을 확인하세요";
      button.innerHTML = '<span class="pwa-install-button-icon">' + appIcon() + '</span><span>앱 설치 안내</span><span class="pwa-install-button-tooltip" role="tooltip">클릭해서 설치 방법과 알림 설정을 확인하세요</span>';
      button.addEventListener("click", () => {
        markGuideSeenThisSession();
        removeInstallButton();
        mountGuide();
      });
      document.body.appendChild(button);
    }

    function mountGuide() {
      if (isInstalled() || document.getElementById(guideId)) return;

      const platform = detectPlatform();
      const data = copy[platform] || copy.desktop;
      ensureStyle();

      const guide = document.createElement("div");
      guide.id = guideId;
      guide.setAttribute("role", "dialog");
      guide.setAttribute("aria-modal", "true");
      guide.setAttribute("aria-labelledby", "pwa-install-guide-title");
      guide.setAttribute("aria-describedby", "pwa-install-guide-subtitle");
      guide.innerHTML = \`
        <section class="pwa-install-card">
          <aside class="pwa-install-intro">
            <div class="pwa-install-app">
              <img class="pwa-install-app-icon" src="/static/icon.png" alt="" loading="lazy" />
              <div>
                <p class="pwa-install-app-name">유방암 위키</p>
                <p class="pwa-install-app-copy">필요할 때 바로 열어보는 학습·치료 정보 노트입니다.</p>
              </div>
            </div>
            <ul class="pwa-install-benefits" aria-label="앱 설치 장점">
              <li>홈 화면에서 바로 실행</li>
              <li>브라우저 주소창 없이 보기</li>
              <li>새 글과 업데이트 알림</li>
            </ul>
          </aside>
          <div class="pwa-install-main">
            <div class="pwa-install-head">
            <div>
              <p class="pwa-install-platform">\${data.label} 안내</p>
              <h2 id="pwa-install-guide-title">홈 화면에 추가하고 알림을 받아보세요</h2>
              <p id="pwa-install-guide-subtitle" class="pwa-install-subtitle">홈 화면에서 바로 열고, 새 글과 업데이트 알림을 받을 수 있습니다.</p>
            </div>
            <button class="pwa-install-close" type="button" aria-label="설치 안내 닫기">\${closeIcon()}</button>
            </div>
            <div class="pwa-install-body">
            <div class="pwa-install-section">
              <span class="pwa-install-section-icon">\${appIcon()}</span>
              <div class="pwa-install-section-content">
                <p class="pwa-install-section-title">설치 방법</p>
                <ol>\${listItems(data.install)}</ol>
              </div>
            </div>
            <div class="pwa-install-section">
              <span class="pwa-install-section-icon">\${bellIcon()}</span>
              <div class="pwa-install-section-content">
                <p class="pwa-install-section-title">알림 설정</p>
                <ol>\${listItems(data.notification)}</ol>
              </div>
            </div>
            </div>
            <div class="pwa-install-actions">
            <button class="pwa-install-secondary" type="button">나중에 보기</button>
            <button class="pwa-install-primary" type="button" hidden>앱 설치하기</button>
            </div>
          </div>
        </section>
      \`;

      const close = () => {
        removeGuide();
      };

      guide.querySelector(".pwa-install-close")?.addEventListener("click", close);
      guide.querySelector(".pwa-install-secondary")?.addEventListener("click", close);
      guide.addEventListener("click", (event) => {
        if (event.target === guide) close();
      });
      document.addEventListener("keydown", function onKeydown(event) {
        if (event.key !== "Escape") return;
        document.removeEventListener("keydown", onKeydown);
        close();
      });

      const installButton = guide.querySelector(".pwa-install-primary");
      if (installButton && deferredInstallPrompt) {
        installButton.hidden = false;
        installButton.addEventListener("click", async () => {
          const promptEvent = deferredInstallPrompt;
          deferredInstallPrompt = null;
          promptEvent.prompt();
          await promptEvent.userChoice.catch(() => undefined);
          close();
        });
      }

      document.body.appendChild(guide);
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      mountInstallButton();
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      removeGuide();
      removeInstallButton();
    });

    window.setTimeout(() => mountInstallButton(), 900);
    document.addEventListener("nav", () => window.setTimeout(() => mountInstallButton(), 250));
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
        script: installGuideScript,
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
