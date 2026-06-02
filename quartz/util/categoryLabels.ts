export const KOREAN_CATEGORY_LABELS: Record<string, string> = {
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

export function getKoreanCategoryLabel(slugSegment: string): string | undefined {
  return KOREAN_CATEGORY_LABELS[slugSegment]
}
