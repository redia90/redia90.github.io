import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const KoreanExplorer = () =>
  Component.Explorer({
    folderClickBehavior: "collapse",
    folderDefaultState: "collapsed",
    mapFn: (node) => {
      const folderNames: Record<string, string> = {
        // 최상위 카테고리
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
        // 허브 서브폴더 (폴더명 → 표시 이름)
        "호르몬치료": "호르몬 치료",
        "항암화학요법": "항암화학요법",
        "TNBC치료": "TNBC 치료",
        "CDK46억제제": "CDK4/6 억제제",
        "HER2표적치료": "HER2 표적 치료",
        "통증관리": "통증 관리",
        "혈관접근장치": "혈관접근장치",
        "약사협진": "약사 협진",
        "유방암수술": "유방암 수술",
        "유방재건수술": "유방 재건수술",
        "유방암AI영상": "유방암 AI 영상",
        "조직검사결과해석": "조직검사 결과 해석",
        "유방암유전상담": "유방암 유전상담",
        "유방암진단체계": "유방암 진단 체계",
        "호스피스완화의료": "호스피스·완화의료",
        "치료준비물": "치료 준비물",
        "2026임상연구업데이트": "2026 임상연구 업데이트",
        "노인유방암": "노인 유방암",
        "TCHP항암": "TCHP 항암 케이스",
        "운동수면위생": "운동·수면·위생",
      }

      if (node.isFolder) {
        const displayName = folderNames[node.slugSegment]
        if (displayName) node.displayName = displayName
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
