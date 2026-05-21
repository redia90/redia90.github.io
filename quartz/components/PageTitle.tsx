import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      <a href={baseDir} class="site-logo-link" aria-label={`${title} 홈으로 이동`}>
        <svg
          class="site-logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 96 32"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="siteLogoRibbon"
              x1="28"
              y1="2"
              x2="68"
              y2="31"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#f073a6" />
              <stop offset="0.5" stop-color="#dc4f87" />
              <stop offset="1" stop-color="#b8366e" />
            </linearGradient>
          </defs>
          <g class="site-logo-symbol">
            <path
              d="M38 2c10 5 15 12 15 21 0 3-1 6-3 9l-11-4c2-3 3-6 2-9-1-4-5-8-13-12l10-5Z"
              fill="url(#siteLogoRibbon)"
            />
            <path
              d="M58 2c-10 5-15 12-15 21 0 3 1 6 3 9l11-4c-2-3-3-6-2-9 1-4 5-8 13-12l-10-5Z"
              fill="url(#siteLogoRibbon)"
            />
            <path
              d="M35 9c6 3 10 7 13 12 3-5 7-9 13-12"
              fill="none"
              stroke="#fff7fb"
              stroke-width="4"
              stroke-linecap="round"
              opacity="0.78"
            />
          </g>
        </svg>
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
  width: 5rem;
  color: var(--dark);
  background-color: transparent;
  border-radius: 8px;
  line-height: 0;
}

.page-title .site-logo-link:hover {
  color: var(--secondary);
}

.page-title .site-logo {
  display: block;
  width: 100%;
  height: auto;
}

@media all and (max-width: 800px) {
  .page-title .site-logo-link {
    width: 4.25rem;
  }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
