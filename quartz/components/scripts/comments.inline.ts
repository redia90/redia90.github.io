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

function getCusdisTheme() {
  return document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light"
}

function getThread() {
  return document.querySelector("#cusdis_thread") as CusdisThread | null
}

function applyCusdisTheme(thread: CusdisThread) {
  thread.dataset.theme = getCusdisTheme()
}

function loadCusdis(thread: CusdisThread) {
  if (!thread.dataset.host || !thread.dataset.appId || !thread.dataset.pageId) {
    return
  }

  applyCusdisTheme(thread)

  const w = window as unknown as { CUSDIS?: CusdisApi }
  if (w.CUSDIS?.renderTo) {
    w.CUSDIS.renderTo(thread)
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
})
