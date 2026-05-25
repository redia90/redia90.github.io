import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"

const SITE_DESCRIPTION =
  "유방암 진단, 검사, 치료, 생활관리, 보험·행정 정보를 환자와 보호자가 이해하기 쉽게 정리한 공개 지식 노트입니다."
const SITE_KEYWORDS = [
  "유방암",
  "유방암 위키",
  "유방암 치료",
  "유방암 검사",
  "유방암 항암",
  "유방암 보호자",
  "유방암 정보",
  "breast cancer",
]
const SECTION_LABELS: Record<string, string> = {
  biology: "생물학",
  diagnosis: "진단",
  treatment: "치료",
  lifestyle: "생활·지원",
  research: "연구",
  cases: "사례",
  glossary: "용어사전",
}

function absoluteUrl(baseUrl: string | undefined, slug?: string): string {
  const base = `https://${baseUrl ?? "example.com"}`
  return slug && slug !== "404" && slug !== "index" ? joinSegments(base, slug) : base
}

function buildStructuredData({
  cfg,
  fileData,
  title,
  description,
  socialUrl,
  imageUrl,
}: {
  cfg: QuartzComponentProps["cfg"]
  fileData: QuartzComponentProps["fileData"]
  title: string
  description: string
  socialUrl: string
  imageUrl: string
}) {
  const tags = (fileData.frontmatter?.tags as string[] | undefined) ?? []
  const dates = fileData.dates
  const isHome = !fileData.slug || fileData.slug === "index"
  const pageType = isHome ? "CollectionPage" : "MedicalWebPage"
  const publisher = {
    "@type": "Organization",
    name: cfg.pageTitle,
    url: `https://${cfg.baseUrl}`,
    logo: `https://${cfg.baseUrl}/static/icon.png`,
  }

  const page = {
    "@type": pageType,
    "@id": `${socialUrl}#webpage`,
    url: socialUrl,
    name: title,
    headline: title,
    description,
    inLanguage: cfg.locale,
    isAccessibleForFree: true,
    image: imageUrl,
    publisher,
    ...(dates?.created ? { datePublished: dates.created.toISOString() } : {}),
    ...(dates?.modified ? { dateModified: dates.modified.toISOString() } : {}),
    ...(tags.length ? { keywords: tags.join(", ") } : { keywords: SITE_KEYWORDS.join(", ") }),
    about: {
      "@type": "MedicalCondition",
      name: "유방암",
      alternateName: "Breast Cancer",
    },
    audience: [
      { "@type": "PatientAudience", audienceType: "유방암 환자" },
      { "@type": "PeopleAudience", audienceType: "유방암 환자 보호자" },
    ],
    medicalAudience: [
      { "@type": "MedicalAudience", audienceType: "Patient" },
      { "@type": "MedicalAudience", audienceType: "Caregiver" },
    ],
  }

  const website = {
    "@type": "WebSite",
    "@id": `https://${cfg.baseUrl}#website`,
    url: `https://${cfg.baseUrl}`,
    name: cfg.pageTitle,
    description: SITE_DESCRIPTION,
    inLanguage: cfg.locale,
    publisher,
  }

  const breadcrumbParts = (fileData.slug ?? "index").split("/").filter(Boolean)
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: cfg.pageTitle,
        item: `https://${cfg.baseUrl}`,
      },
      ...breadcrumbParts.map((part, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: idx === breadcrumbParts.length - 1 ? title : (SECTION_LABELS[part] ?? part),
        item: absoluteUrl(cfg.baseUrl, breadcrumbParts.slice(0, idx + 1).join("/")),
      })),
    ],
  }

  return {
    "@context": "https://schema.org",
    "@graph": isHome ? [publisher, website, page] : [publisher, website, page, breadcrumb],
  }
}

export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.png")

    // Url of current page
    const socialUrl = absoluteUrl(cfg.baseUrl, fileData.slug)

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const ogImageDefaultPath = `https://${cfg.baseUrl}/static/og-image.png`
    const pageKeywords = [
      ...SITE_KEYWORDS,
      ...(((fileData.frontmatter?.tags as string[] | undefined) ?? []) as string[]),
    ]
    const structuredData = buildStructuredData({
      cfg,
      fileData,
      title,
      description,
      socialUrl,
      imageUrl: ogImageDefaultPath,
    })

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css"
        />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={socialUrl} />
        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <meta name="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content={fileData.slug === "index" ? "website" : "article"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />
        <meta property="og:locale" content="ko_KR" />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta
              property="og:image:type"
              content={`image/${getFileExtension(ogImageDefaultPath)?.replace(/^\./, "") ?? "png"}`}
            />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}
        {fileData.dates?.created && (
          <meta property="article:published_time" content={fileData.dates.created.toISOString()} />
        )}
        {fileData.dates?.modified && (
          <meta property="article:modified_time" content={fileData.dates.modified.toISOString()} />
        )}
        {((fileData.frontmatter?.tags as string[] | undefined) ?? []).map((tag) => (
          <meta property="article:tag" content={tag} />
        ))}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="keywords" content={Array.from(new Set(pageKeywords)).join(", ")} />
        <meta name="generator" content="Quartz" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
