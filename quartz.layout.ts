import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const CHILD_PAGES = new Set([
  "2026임상연구업데이트_주요결과",
  "2026임상연구업데이트_한국적용",
  "CDK46억제제_실전가이드",
  "CDK46억제제_약제비교",
  "HER2표적치료_신보조2026",
  "HER2표적치료_약제가이드",
  "TCHP항암_사례집",
  "TCHP항암_증상관리",
  "TNBC치료_약제치료",
  "TNBC치료_임상데이터",
  "노인유방암_케이스지원",
  "노인유방암_평가치료",
  "수면위생가이드",
  "약사협진_실전가이드",
  "약사협진_핵심상호작용",
  "운동가이드",
  "유방암AI영상_도구별",
  "유방암AI영상_환자가이드",
  "유방암수술_2026트렌드",
  "유방암수술_수술방식",
  "유방암수술_환자동선",
  "유방암유전상담_BRCA검사",
  "유방암유전상담_상담실전",
  "유방암진단체계_병기NCCN",
  "유방암진단체계_진단흐름",
  "유방재건수술_방식선택",
  "유방재건수술_실전가이드",
  "조직검사결과해석_병변분류",
  "조직검사결과해석_수용체등급",
  "치료준비물_입원수술항암",
  "치료준비물_카탈로그",
  "통증관리_단계별",
  "통증관리_약물관리",
  "항암화학요법_부작용관리",
  "항암화학요법_약제회차관리",
  "혈관접근장치_관리합병증",
  "혈관접근장치_종류선택",
  "호르몬치료_부작용관리",
  "호르몬치료_신약2026",
  "호르몬치료_약제별가이드",
  "호스피스완화의료_의사결정",
  "호스피스완화의료_임상가이드",
])

const KoreanExplorer = () =>
  Component.Explorer({
    folderClickBehavior: "collapse",
    folderDefaultState: "collapsed",
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

      if (node.isFolder) {
        const displayName = folderNames[node.slugSegment]
        if (displayName) node.displayName = displayName
        return
      }

      if (CHILD_PAGES.has(node.slugSegment)) {
        const underscoreIdx = node.slugSegment.indexOf("_")
        const suffix =
          underscoreIdx !== -1 ? node.slugSegment.slice(underscoreIdx + 1) : node.slugSegment
        node.displayName = suffix
      }
    },
  })

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [Component.GlossaryPopup()],
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
