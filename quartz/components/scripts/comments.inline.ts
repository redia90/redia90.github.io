type CusdisThread = HTMLElement & {
  dataset: DOMStringMap & {
    host?: string
    appId?: string
    pageId?: string
    pageUrl?: string
    pageTitle?: string
    lang?: string
    theme?: string
  }
}

type CusdisApi = {
  renderTo?: (target: Element) => void
}

const CUSDIS_SCRIPT_ID = "cusdis-sdk"
const CUSDIS_MIN_HEIGHT = 640
const CUSDIS_HEIGHT_BUFFER = 180

function getCusdisTheme() {
  return document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light"
}

function getThread() {
  return document.querySelector("#cusdis_thread") as CusdisThread | null
}

function applyCusdisTheme(thread: CusdisThread) {
  thread.dataset.theme = getCusdisTheme()
}

function findCusdisIframe(thread = getThread()) {
  return thread?.querySelector("iframe") as HTMLIFrameElement | null
}

function normalizeCusdisIframe(thread = getThread()) {
  const iframe = findCusdisIframe(thread)
  if (!iframe) {
    return
  }

  iframe.setAttribute("scrolling", "auto")
  iframe.style.display = "block"
  iframe.style.width = "100%"
  iframe.style.minHeight = `${CUSDIS_MIN_HEIGHT}px`
  if (!iframe.style.height) {
    iframe.style.height = `${CUSDIS_MIN_HEIGHT}px`
  }
  iframe.style.border = "0"
  iframe.style.overflow = "auto"
}

function scheduleCusdisNormalize(thread = getThread()) {
  if (!thread) {
    return
  }

  window.setTimeout(() => normalizeCusdisIframe(thread), 0)
  window.setTimeout(() => normalizeCusdisIframe(thread), 500)
  window.setTimeout(() => normalizeCusdisIframe(thread), 1500)
}

function loadCusdis(thread: CusdisThread) {
  if (!thread.dataset.host || !thread.dataset.appId || !thread.dataset.pageId) {
    return
  }

  applyCusdisTheme(thread)

  const w = window as unknown as { CUSDIS?: CusdisApi }
  if (w.CUSDIS?.renderTo) {
    w.CUSDIS.renderTo(thread)
    scheduleCusdisNormalize(thread)
    return
  }

  if (document.getElementById(CUSDIS_SCRIPT_ID)) {
    return
  }

  const script = document.createElement("script")
  script.id = CUSDIS_SCRIPT_ID
  script.src = `${thread.dataset.host.replace(/\/$/, "")}/js/cusdis.es.js`
  script.async = true
  script.defer = true
  script.onload = () => {
    const api = (window as unknown as { CUSDIS?: CusdisApi }).CUSDIS
    api?.renderTo?.(thread)
    scheduleCusdisNormalize(thread)
  }
  document.body.appendChild(script)
}

function renderCusdis() {
  const thread = getThread()
  if (thread) {
    loadCusdis(thread)
  }
}

document.addEventListener("nav", renderCusdis)
document.addEventListener("themechange", () => {
  const thread = getThread()
  if (!thread) {
    return
  }

  applyCusdisTheme(thread)
  const api = (window as unknown as { CUSDIS?: CusdisApi }).CUSDIS
  api?.renderTo?.(thread)
  scheduleCusdisNormalize(thread)
})

window.addEventListener("message", (event) => {
  if (typeof event.data !== "string") {
    return
  }

  try {
    const message = JSON.parse(event.data) as { from?: string; event?: string; data?: unknown }
    if (message.from !== "cusdis" || message.event !== "resize") {
      return
    }

    const iframe = findCusdisIframe()
    const height = Number(message.data)
    if (!iframe || !Number.isFinite(height)) {
      return
    }

    iframe.setAttribute("scrolling", "auto")
    iframe.style.overflow = "auto"
    iframe.style.height = `${Math.max(CUSDIS_MIN_HEIGHT, height + CUSDIS_HEIGHT_BUFFER)}px`
  } catch {
    return
  }
})
