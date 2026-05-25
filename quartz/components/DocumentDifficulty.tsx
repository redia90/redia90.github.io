import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

type Difficulty = {
  level: "easy" | "medium" | "hard"
  label: string
  note: string
}

const medicalTerms = [
  "HER2",
  "ER",
  "PR",
  "Ki-67",
  "TNM",
  "IHC",
  "FISH",
  "BRCA",
  "TNBC",
  "DCIS",
  "IDC",
  "LVI",
  "pCR",
  "non-pCR",
  "Oncotype",
  "PARP",
  "CDK4/6",
  "ADC",
  "PD-L1",
  "TCHP",
  "림프절",
  "수용체",
  "병기",
  "전이",
  "재발",
  "표적치료",
  "면역항암",
  "호르몬",
  "신보조",
  "보조요법",
  "절제연",
  "림프혈관침윤",
  "유전자",
  "임상시험",
]

function getDifficulty(text: string, category?: string): Difficulty {
  const normalizedText = text.toLowerCase()
  const termHits = medicalTerms.reduce((count, term) => {
    const pattern = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return count + (normalizedText.match(new RegExp(pattern, "g"))?.length ?? 0)
  }, 0)

  let score = 0
  if (text.length > 4500) score += 1
  if (text.length > 9000) score += 1
  if (termHits > 14) score += 1
  if (termHits > 34) score += 1
  if (category === "research" || category === "treatment") score += 1

  if (score <= 1) {
    return {
      level: "easy",
      label: "쉬움",
      note: "기본 개념 중심",
    }
  }

  if (score <= 3) {
    return {
      level: "medium",
      label: "보통",
      note: "검사·치료 용어 포함",
    }
  }

  return {
    level: "hard",
    label: "심화",
    note: "수치·약제·연구 내용 포함",
  }
}

const DocumentDifficulty: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  if (slug === "index" || slug.startsWith("tags/")) return null

  const text = fileData.text ?? ""
  if (!text) return null

  const category = fileData.frontmatter?.category?.toString()
  const difficulty = getDifficulty(text, category)

  return (
    <div class={`doc-difficulty doc-difficulty-${difficulty.level}`} aria-label="문서 난이도">
      <span class="doc-difficulty-icon" aria-hidden="true">
        {difficulty.level === "easy" ? "1" : difficulty.level === "medium" ? "2" : "3"}
      </span>
      <span class="doc-difficulty-kicker">문서 난이도</span>
      <strong>{difficulty.label}</strong>
      <span class="doc-difficulty-note">{difficulty.note}</span>
    </div>
  )
}

DocumentDifficulty.css = `
.doc-difficulty {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
  width: fit-content;
  max-width: 100%;
  margin: 0.45rem 0 0.75rem;
  padding: 0.42rem 0.62rem 0.42rem 0.48rem;
  border: 1px solid color-mix(in srgb, var(--secondary) 24%, var(--lightgray));
  border-radius: 999px;
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--secondary) 10%, transparent), transparent 52%),
    var(--light);
  color: var(--darkgray);
  font-size: 0.86rem;
  line-height: 1.25;
  box-shadow: 0 8px 22px rgb(0 0 0 / 0.045);
}

.doc-difficulty-icon {
  display: inline-grid;
  place-items: center;
  width: 1.42rem;
  height: 1.42rem;
  border-radius: 999px;
  background: var(--secondary);
  color: var(--light);
  font-size: 0.78rem;
  font-weight: 800;
}

.doc-difficulty-kicker {
  color: var(--gray);
  font-weight: 700;
}

.doc-difficulty strong {
  color: var(--dark);
  font-weight: 800;
}

.doc-difficulty-note {
  color: var(--darkgray);
}

.doc-difficulty-hard {
  border-color: color-mix(in srgb, #d04f72 38%, var(--lightgray));
}

.doc-difficulty-hard .doc-difficulty-icon {
  background: #d04f72;
}

@media all and (max-width: 800px) {
  .doc-difficulty {
    width: 100%;
    border-radius: 12px;
  }
}
`

export default (() => DocumentDifficulty) satisfies QuartzComponentConstructor
