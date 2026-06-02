import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { joinSegments } from "../util/path"

function pageUrl(baseUrl: string | undefined, slug?: string) {
  const base = `https://${baseUrl ?? "wiki.breast-cancer.workers.dev"}`
  return slug && slug !== "index" && slug !== "404" ? joinSegments(base, slug) : base
}

const shareScript = `
(() => {
  const ready = () => {
    const buttons = document.querySelectorAll("[data-page-share-url]");
    for (const button of buttons) {
      if (!(button instanceof HTMLButtonElement) || button.dataset.shareReady === "true") continue;
      button.dataset.shareReady = "true";

      const label = button.querySelector(".page-share-label");
      const defaultLabel = label?.textContent || "공유";
      const setLabel = (text) => {
        if (!label) return;
        label.textContent = text;
        window.setTimeout(() => {
          label.textContent = defaultLabel;
        }, 1800);
      };

      button.addEventListener("click", async () => {
        const url = button.dataset.pageShareUrl || window.location.href;
        const title = button.dataset.pageShareTitle || document.title;
        const text = button.dataset.pageShareText || "유방암 위키 문서를 공유합니다.";

        try {
          if (navigator.share) {
            await navigator.share({ title, text, url });
            setLabel("공유 완료");
            return;
          }

          await navigator.clipboard.writeText(url);
          setLabel("URL 복사됨");
        } catch (error) {
          if (error && error.name === "AbortError") return;

          try {
            await navigator.clipboard.writeText(url);
            setLabel("URL 복사됨");
          } catch {
            setLabel("복사 실패");
          }
        }
      });
    }
  };

  document.addEventListener("nav", ready);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ready, { once: true });
  } else {
    ready();
  }
})();
`

const PageShare: QuartzComponent = ({ cfg, fileData, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug ?? "index"
  const url = pageUrl(cfg.baseUrl, slug)
  const title = fileData.frontmatter?.title?.toString() ?? cfg.pageTitle
  const isHome = slug === "index"

  return (
    <div class={classNames(displayClass, "page-share")}>
      <button
        class="page-share-button"
        type="button"
        data-page-share-url={url}
        data-page-share-title={title}
        data-page-share-text={
          isHome ? "유방암 위키를 공유합니다." : "유방암 위키 문서를 공유합니다."
        }
        aria-label="현재 페이지 URL 공유"
        title="현재 페이지 URL 공유"
      >
        <span class="page-share-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            stroke-width="2.1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" />
            <path d="M12 16V4" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </span>
        <span class="page-share-label">공유</span>
      </button>
    </div>
  )
}

PageShare.afterDOMLoaded = shareScript

PageShare.css = `
.page-share {
  display: flex;
  align-items: center;
  margin: 0.15rem 0 0.85rem;
}

.page-share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.48rem;
  min-height: 2.28rem;
  border: 1px solid color-mix(in srgb, var(--secondary) 22%, var(--lightgray));
  border-radius: 999px;
  padding: 0.42rem 0.62rem 0.42rem 0.48rem;
  background: color-mix(in srgb, var(--light) 92%, white);
  color: var(--secondary);
  font: inherit;
  font-size: 0.86rem;
  font-weight: 650;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.045);
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease;
}

.page-share-button:hover,
.page-share-button:focus-visible {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--secondary) 42%, var(--lightgray));
  background: color-mix(in srgb, var(--secondary) 8%, var(--light));
  box-shadow: 0 10px 28px rgb(0 0 0 / 0.075);
  outline: none;
}

.page-share-icon {
  display: inline-grid;
  width: 1.55rem;
  height: 1.55rem;
  place-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--secondary) 12%, transparent);
  color: var(--secondary);
}

@media all and (max-width: 800px) {
  .page-share {
    margin-top: 0.5rem;
  }
}

.page-header > .popover-hint {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 1rem;
  align-items: start;
}

.page-header > .popover-hint > .breadcrumb-container,
.page-header > .popover-hint > .doc-difficulty,
.page-header > .popover-hint > .tags,
.page-header > .popover-hint > .doctor-check {
  grid-column: 1 / -1;
}

.page-header > .popover-hint > .article-title {
  grid-column: 1;
  min-width: 0;
}

.page-header > .popover-hint > .content-meta {
  grid-column: 1 / -1;
  min-width: 0;
}

.page-header > .popover-hint > .page-share {
  grid-column: 2;
  grid-row: 2;
  justify-self: end;
  align-self: center;
  margin: 2rem 0 0;
}

@media all and (max-width: 800px) {
  .page-header > .popover-hint > .page-share {
    margin: 2rem 0 0;
  }
}

@media all and (max-width: 420px) {
  .page-share-button {
    padding-right: 0.52rem;
  }

  .page-share-icon {
    width: 1.45rem;
    height: 1.45rem;
  }
}
`

export default (() => PageShare) satisfies QuartzComponentConstructor
