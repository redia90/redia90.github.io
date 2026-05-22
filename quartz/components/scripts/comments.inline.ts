type DisqusHost = HTMLElement & {
  dataset: DOMStringMap & {
    shortname: string
    pageId: string
    pageUrl: string
    pageTitle: string
    language?: string
  }
}

/** Disqus `this` in disqus_config / reset callbacks */
interface DisqusConfigThis {
  page: { url: string; identifier: string; title: string }
  language?: string
}

let themeResetTimer: number | undefined

function getDisqusTheme() {
  return document.documentElement.getAttribute("saved-theme") === "dark" ? "dark" : "light"
}

function applyDisqusThemeHint(host: DisqusHost) {
  const theme = getDisqusTheme()
  const isDark = theme === "dark"
  const thread = host.querySelector("#disqus_thread") as HTMLElement | null

  host.dataset.theme = theme
  host.style.colorScheme = theme
  host.style.backgroundColor = "var(--light)"
  host.style.color = isDark ? "#d4d4d4" : "#2b2b2b"

  if (thread) {
    thread.style.colorScheme = theme
    thread.style.backgroundColor = "var(--light)"
    thread.style.color = isDark ? "#d4d4d4" : "#2b2b2b"
  }
}

function loadDisqus(host: DisqusHost) {
  const shortname = host.dataset.shortname
  const identifier = host.dataset.pageId
  const url = host.dataset.pageUrl
  const title = host.dataset.pageTitle || document.title
  const language = host.dataset.language

  if (!shortname || !identifier || !url) {
    return
  }

  applyDisqusThemeHint(host)

  const w = window as unknown as {
    DISQUS?: { reset: (opts: { reload: boolean; config: () => void }) => void }
    disqus_config?: () => void
  }

  const applyPage = function (this: DisqusConfigThis) {
    this.page.url = url
    this.page.identifier = identifier
    this.page.title = title
    if (language) {
      this.language = language
    }
  }

  if (w.DISQUS) {
    w.DISQUS.reset({
      reload: true,
      config: function () {
        applyPage.call(this as unknown as DisqusConfigThis)
      },
    })
  } else {
    w.disqus_config = function () {
      applyPage.call(this as unknown as DisqusConfigThis)
    }
    const s = document.createElement("script")
    s.src = `https://${shortname}.disqus.com/embed.js`
    s.async = true
    s.setAttribute("data-timestamp", Date.now().toString())
    document.body.appendChild(s)
  }
}

function resetDisqusTheme() {
  const disqusHost = document.querySelector(".quartz-comments-disqus") as DisqusHost | null
  if (!disqusHost) {
    return
  }

  applyDisqusThemeHint(disqusHost)
  window.clearTimeout(themeResetTimer)
  themeResetTimer = window.setTimeout(() => loadDisqus(disqusHost), 250)
}

document.addEventListener("nav", () => {
  const disqusHost = document.querySelector(".quartz-comments-disqus") as DisqusHost | null
  if (disqusHost) {
    loadDisqus(disqusHost)
  }
})

document.addEventListener("themechange", resetDisqusTheme)
