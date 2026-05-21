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
          viewBox="0 0 56 56"
          role="img"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient
              id="siteLogoRibbon"
              x1="24"
              y1="8"
              x2="42"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#f073a6" />
              <stop offset="0.5" stop-color="#dc4f87" />
              <stop offset="1" stop-color="#b8366e" />
            </linearGradient>
          </defs>
          <g class="site-logo-symbol">
            <rect
              x="1.5"
              y="1.5"
              width="53"
              height="53"
              rx="15"
              fill="#fff7fb"
              stroke="#ead7df"
              stroke-width="3"
            />
            <path
              d="M24 9c8 5 12 12 12 21 0 8-5 16-14 24l-9-10c8-7 12-12 12-17 0-4-3-8-8-11l7-7Z"
              fill="url(#siteLogoRibbon)"
            />
            <path
              d="M32 9c-8 5-12 12-12 21 0 8 5 16 14 24l9-10c-8-7-12-12-12-17 0-4 3-8 8-11l-7-7Z"
              fill="url(#siteLogoRibbon)"
            />
            <path
              d="M20 18c4 3 7 7 8 11 1-4 4-8 8-11"
              fill="none"
              stroke="#fff7fb"
              stroke-width="5"
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
  width: 3.5rem;
  color: var(--dark);
  background-color: transparent;
  border-radius: 8px;
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
    width: 3rem;
  }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
