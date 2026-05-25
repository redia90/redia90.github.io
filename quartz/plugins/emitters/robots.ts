import { FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"

export const Robots: QuartzEmitterPlugin = () => ({
  name: "Robots",
  async *emit(ctx) {
    const baseUrl = ctx.cfg.configuration.baseUrl ?? ""
    const content = [
      "User-agent: *",
      "Allow: /",
      "",
      "Disallow: /private/",
      "Disallow: /templates/",
      "",
      `Sitemap: https://${baseUrl}/sitemap.xml`,
      `Host: https://${baseUrl}`,
      "",
    ].join("\n")

    yield write({
      ctx,
      content,
      slug: "robots" as FullSlug,
      ext: ".txt",
    })
  },
  async *partialEmit() {},
})
