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
          viewBox="0 0 236 56"
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
            <linearGradient
              id="siteLogoPage"
              x1="10"
              y1="32"
              x2="50"
              y2="50"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color="#ffffff" />
              <stop offset="1" stop-color="#edf8f4" />
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
              d="M12 34c6-5 14-7 23-4 4 1 8 3 11 6 3-3 8-5 14-5v16c-7 0-12 2-16 5-2 1-4 1-6 0-5-3-14-4-26-2V34Z"
              fill="url(#siteLogoPage)"
              stroke="#d7ebe5"
              stroke-width="3"
              stroke-linejoin="round"
            />
            <path
              d="M28 34c-6-5-9-10-9-16 0-6 3-11 9-15l6 9c-4 3-6 6-6 10s2 7 6 11l-6 1Z"
              fill="url(#siteLogoRibbon)"
            />
            <path
              d="M38 34c6-5 9-10 9-16 0-6-3-11-9-15l-6 9c4 3 6 6 6 10s-2 7-6 11l6 1Z"
              fill="url(#siteLogoRibbon)"
            />
            <path
              d="M24 17c4 3 7 6 9 10 2-4 5-7 9-10"
              fill="none"
              stroke="#fff7fb"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M18 40h10M18 46h12M39 40h10"
              stroke="#84a59d"
              stroke-width="3"
              stroke-linecap="round"
              opacity="0.8"
            />
          </g>
          <text class="site-logo-wordmark" x="66" y="28">
            유방암 위키
          </text>
          <text class="site-logo-subtitle" x="68" y="43">
            BREAST CANCER WIKI
          </text>
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
  width: min(13.75rem, 100%);
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

.page-title .site-logo-wordmark {
  fill: currentColor;
  font-family: var(--headerFont);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0;
}

.page-title .site-logo-subtitle {
  fill: var(--darkgray);
  font-family: var(--bodyFont);
  font-size: 7.5px;
  font-weight: 700;
  letter-spacing: 1.2px;
  opacity: 0.72;
}

@media all and (max-width: 800px) {
  .page-title .site-logo-link {
    width: min(10.5rem, 100%);
  }

  .page-title .site-logo-subtitle {
    display: none;
  }
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
