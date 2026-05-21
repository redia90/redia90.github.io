import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { joinSegments } from "../util/path"
// @ts-ignore
import script from "./scripts/comments.inline"

type DisqusOpts = {
  provider: "disqus"
  options: {
    /** Disqus admin에서 만든 사이트 shortname (https://disqus.com/admin/create/) */
    shortname: string
    /** 예: ko, en */
    language?: string
  }
}

export type CommentsOptions = DisqusOpts

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

  Comments.afterDOMLoaded = script

  return Comments
}) satisfies QuartzComponentConstructor<CommentsOptions>
