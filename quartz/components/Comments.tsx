import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { joinSegments } from "../util/path"
// @ts-ignore
import script from "./scripts/comments.inline"

type CusdisOpts = {
  provider: "cusdis"
  options: {
    /** Cusdis dashboard에서 발급한 App ID */
    appId?: string
    /** 기본값: https://cusdis.com, 셀프 호스팅 시 해당 URL */
    host?: string
    /** 예: ko, en */
    language?: string
  }
}

export type CommentsOptions = CusdisOpts

export default ((opts: CommentsOptions) => {
  const Comments: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    const base = cfg.baseUrl ?? "example.com"
    const origin = `https://${base}`
    const slug = fileData.slug!
    const pageUrl = joinSegments(origin, slug)
    const pageTitle = (fileData.frontmatter?.title as string | undefined) ?? slug

    const appId = opts.options.appId?.trim()
    const host = opts.options.host?.trim() || "https://cusdis.com"

    return (
      <section class={classNames(displayClass, "quartz-comments-cusdis")} data-provider="cusdis">
        <div class="quartz-comments-title">댓글</div>
        {appId ? (
          <div
            id="cusdis_thread"
            data-host={host}
            data-app-id={appId}
            data-page-id={slug}
            data-page-url={pageUrl}
            data-page-title={pageTitle}
            data-lang={opts.options.language ?? "ko"}
          ></div>
        ) : (
          <p class="quartz-comments-config-missing">
            Cusdis App ID가 설정되지 않았습니다. 댓글을 사용하려면 CUSDIS_APP_ID를 설정하세요.
          </p>
        )}
      </section>
    )
  }

  Comments.afterDOMLoaded = script
  Comments.css = `
.quartz-comments-cusdis {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--lightgray);
  background: var(--light);
  color: var(--darkgray);
  color-scheme: light dark;
}

:root[saved-theme="dark"] .quartz-comments-cusdis {
  color-scheme: dark;
  background: var(--light);
  color: var(--darkgray);
}

.quartz-comments-title {
  margin-bottom: 0.85rem;
  color: var(--dark);
  font-size: 1rem;
  font-weight: 600;
}

.quartz-comments-cusdis #cusdis_thread {
  background: var(--light);
  color: inherit;
}

.quartz-comments-config-missing {
  margin: 0;
  padding: 0.9rem 1rem;
  border: 1px solid var(--lightgray);
  border-radius: 8px;
  background: var(--highlight);
  color: var(--darkgray);
  font-size: 0.9rem;
}
`

  return Comments
}) satisfies QuartzComponentConstructor<CommentsOptions>
