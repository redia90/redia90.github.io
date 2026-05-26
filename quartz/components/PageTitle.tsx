import { joinSegments, pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  const logoSrc = joinSegments(baseDir, "static/header-logo.png")
  const darkLogoSrc = joinSegments(baseDir, "static/header-logo-dark.png")
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir} class="site-logo-link" aria-label={`${title} 홈으로 이동`}>
        <img
          class="site-logo site-logo-light"
          src={logoSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="eager"
        />
        <img
          class="site-logo site-logo-dark"
          src={darkLogoSrc}
          alt=""
          aria-hidden="true"
          decoding="async"
          loading="eager"
        />
      </a>
    </h2>
  )
}

PageTitle.css = `
.page-title {
  line-height: 1;
  margin: 0;
  font-family: var(--titleFont);
  max-width: 100%;
  overflow-wrap: anywhere;
  word-break: keep-all;
}

.page-title .site-logo-link {
  display: inline-flex;
  width: min(15rem, 100%);
  max-width: 100%;
  color: var(--dark);
  background-color: transparent;
  border-radius: 0;
  line-height: 0;
  transform: translateY(0.16rem);
}

.page-title .site-logo-link:hover {
  color: var(--secondary);
}

.page-title .site-logo {
  display: block;
  width: 100%;
  height: auto;
  margin: 0;
  border-radius: 0;
  content-visibility: visible;
}

.page-title .site-logo-dark {
  display: none;
}

:root[saved-theme="dark"] .page-title .site-logo-light {
  display: none;
}

:root[saved-theme="dark"] .page-title .site-logo-dark {
  display: block;
}

@media all and (max-width: 800px) {
  .page-title .site-logo-link {
    width: 10rem;
  }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
