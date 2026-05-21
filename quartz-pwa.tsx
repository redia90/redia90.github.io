import { h } from "preact"
import { QuartzEmitterPlugin } from "./quartz/plugins/types"
import { write } from "./quartz/plugins/emitters/helpers"
import { FullSlug } from "./quartz/util/path"

const CACHE_VERSION = "v3"
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
    ],
  }),
})
