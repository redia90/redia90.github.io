import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { joinSegments } from "../util/path"
// @ts-ignore
import script from "./scripts/comments.inline"

type GiscusOpts = {
  provider: "giscus"
  options: {
    repo: `${string}/${string}`
    repoId: string
    category: string
    categoryId: string
    themeUrl?: string
    lightTheme?: string
    darkTheme?: string
    mapping?: "url" | "title" | "og:title" | "specific" | "number" | "pathname"
    strict?: boolean
    reactionsEnabled?: boolean
    inputPosition?: "top" | "bottom"
    lang?: string
  }
}

type DisqusOpts = {
  provider: "disqus"
  options: {
    /** Disqus admin에서 만든 사이트 shortname (https://disqus.com/admin/create/) */
    shortname: string
    /** 예: ko, en */
    language?: string
  }
}

export type CommentsOptions = GiscusOpts | DisqusOpts

function boolToStringBool(b: boolean): string {
  return b ? "1" : "0"
}

export default ((opts: CommentsOptions) => {
  const Comments: QuartzComponent = ({ displayClass, fileData, cfg }: QuartzComponentProps) => {
    const disableComment: boolean =
      typeof fileData.frontmatter?.comments !== "undefined" &&
      (!fileData.frontmatter?.comments || fileData.frontmatter?.comments === "false")
    if (disableComment) {
      return <></>
    }

    if (opts.provider === "disqus") {
      const base = cfg.baseUrl ?? "example.com"
      const origin = `https://${base}`
      const slug = fileData.slug!
      const pageUrl = joinSegments(origin, slug)
      const pageTitle = (fileData.frontmatter?.title as string | undefined) ?? slug

      return (
        <div
          class={classNames(displayClass, "quartz-comments-disqus")}
          data-provider="disqus"
          data-shortname={opts.options.shortname}
          data-page-id={slug}
          data-page-url={pageUrl}
          data-page-title={pageTitle}
          data-language={opts.options.language ?? ""}
        >
          <div id="disqus_thread"></div>
        </div>
      )
    }

    const g = opts.options
    return (
      <div
        class={classNames(displayClass, "giscus")}
        data-provider="giscus"
        data-repo={g.repo}
        data-repo-id={g.repoId}
        data-category={g.category}
        data-category-id={g.categoryId}
        data-mapping={g.mapping ?? "url"}
        data-strict={boolToStringBool(g.strict ?? true)}
        data-reactions-enabled={boolToStringBool(g.reactionsEnabled ?? true)}
        data-input-position={g.inputPosition ?? "bottom"}
        data-light-theme={g.lightTheme ?? "light"}
        data-dark-theme={g.darkTheme ?? "dark"}
        data-theme-url={g.themeUrl ?? `https://${cfg.baseUrl ?? "example.com"}/static/giscus`}
        data-lang={g.lang ?? "en"}
      ></div>
    )
  }

  Comments.afterDOMLoaded = script

  return Comments
}) satisfies QuartzComponentConstructor<CommentsOptions>
