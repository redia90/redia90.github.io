import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const KoreanExplorer = () =>
  Component.Explorer({
    mapFn: (node) => {
      const folderNames: Record<string, string> = {
        biology: "생물학·위험인자",
        "diagnosis-tests": "진단 — 검사·바이오마커",
        "diagnosis-imaging": "진단 — 영상·AI",
        "diagnosis-workflow": "진단 — 흐름·검진·상담",
        "treatment-surgery": "치료 — 수술·재건",
        "treatment-systemic": "치료 — 전신 약물",
        "treatment-radiation": "치료 — 방사선",
        "treatment-supportive": "치료 — 보조 케어·합병증",
        research: "연구·통계·최신 동향",
        "nutrition-exercise": "생활 — 식이·운동",
        "mental-experience": "생활 — 정신·환자 경험",
        "insurance-admin": "생활 — 보험·행정·권리",
        "preparation-facilities": "생활 — 준비물·기관 선택",
        cases: "사례",
        glossary: "용어사전",
      }
      const displayName = folderNames[node.slugSegment]
      if (node.isFolder && displayName) {
        node.displayName = displayName
      }
    },
  })

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.GlossaryPopup(),
    Component.Comments({
      provider: "cusdis",
      options: {
        appId: process.env.CUSDIS_APP_ID,
        host: process.env.CUSDIS_HOST ?? "https://cusdis.com",
        language: "ko",
      },
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/redia90/redia90.github.io",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs({ rootName: "홈" }),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.PageShare(),
    Component.DocumentDifficulty(),
    Component.TagList(),
    Component.DoctorCheck(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    KoreanExplorer(),
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs({ rootName: "홈" }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.PageShare(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    KoreanExplorer(),
  ],
  right: [],
}
