import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const categoryQuestions: Record<string, string[]> = {
  diagnosis: [
    "이 결과가 최종 병리 결과인지, 수술 후 바뀔 수 있는 항목이 있는지",
    "ER/PR/HER2/Ki-67, 림프절, 절제연 결과가 치료 계획에 어떤 영향을 주는지",
    "추가 검사, 재판독, 세컨드 오피니언이 필요한 상황인지",
  ],
  treatment: [
    "이 치료를 선택한 가장 큰 이유와 기대 효과는 무엇인지",
    "가장 주의해야 할 부작용과 병원에 바로 연락해야 하는 증상은 무엇인지",
    "치료 일정이 지연되거나 용량이 조정될 수 있는 기준은 무엇인지",
  ],
  research: [
    "이 내용이 현재 표준치료인지, 연구 단계인지",
    "내 병기·서브타입·이전 치료 이력에 실제로 해당되는지",
    "국내 병원과 보험 기준에서 적용 가능한 선택지인지",
  ],
  lifestyle: [
    "현재 치료 단계에서 피해야 할 음식, 보충제, 운동이 있는지",
    "복용 중인 약·영양제와 치료 약 사이 상호작용이 있는지",
    "증상 관리나 재활을 위해 의뢰받을 수 있는 진료과가 있는지",
  ],
  cases: [
    "이 사례와 내 상황이 다른 핵심 조건은 무엇인지",
    "사례에 나온 치료가 내 병기·서브타입에도 적용 가능한지",
    "비슷한 상황에서 표준적으로 비교하는 치료 선택지는 무엇인지",
  ],
  biology: [
    "이 생물학적 특징이 실제 치료 결정에 반영되는 항목인지",
    "내 검사 결과에서 같은 표지자나 유전자 변이가 확인됐는지",
    "추가 유전자 검사나 바이오마커 검사가 필요한지",
  ],
}

const fallbackQuestions = [
  "이 정보가 내 병기·서브타입·치료 단계에 해당되는지",
  "지금 결정해야 할 것과 나중에 확인해도 되는 것은 무엇인지",
  "진료 후 집에서 관찰해야 할 증상이나 기록할 항목이 있는지",
]

function toQuestionList(value: unknown): string[] | undefined {
  if (!value) return undefined
  if (Array.isArray(value)) return value.map((item) => item?.toString()).filter(Boolean)
  return value
    .toString()
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const DoctorCheck: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  if (slug === "index" || slug.startsWith("tags/") || slug.startsWith("glossary/")) return null

  const category = fileData.frontmatter?.category?.toString() ?? slug.split("/")[0]
  const customQuestions = toQuestionList(fileData.frontmatter?.doctorQuestions)
  const questions = customQuestions?.length
    ? customQuestions.slice(0, 4)
    : (categoryQuestions[category] ?? fallbackQuestions)

  return (
    <aside class="doctor-check" aria-labelledby="doctor-check-title">
      <div class="doctor-check-header">
        <span class="doctor-check-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M9.25 9.35a2.85 2.85 0 1 1 4.86 2.02c-.92.88-2.06 1.42-2.06 2.88" />
            <circle class="doctor-check-icon-dot" cx="12.05" cy="17" r="0.55" />
          </svg>
        </span>
        <div>
          <p id="doctor-check-title">의사에게 꼭 확인하세요</p>
          <span>본문을 읽고 진료실에서 바로 물어볼 질문입니다.</span>
        </div>
      </div>
      <ul>
        {questions.map((question) => (
          <li>{question}</li>
        ))}
      </ul>
    </aside>
  )
}

DoctorCheck.css = `
.doctor-check {
  margin: 1rem 0 1.25rem;
  padding: 1.05rem 1.1rem;
  border: 1px solid color-mix(in srgb, #f08aad 52%, var(--lightgray));
  border-radius: 12px;
  background:
    linear-gradient(135deg, rgba(255, 244, 248, 0.98), rgba(255, 255, 255, 0.72)),
    radial-gradient(circle at 1rem 1rem, rgba(240, 68, 127, 0.14), transparent 42%),
    var(--light);
  box-shadow: 0 12px 28px rgb(194 67 109 / 0.12);
}

.doctor-check-header {
  display: grid;
  grid-template-columns: 2.2rem minmax(0, 1fr);
  align-items: start;
  gap: 0.78rem;
  margin-bottom: 0.72rem;
}

.doctor-check-icon {
  display: grid;
  place-items: center;
  width: 2.2rem;
  height: 2.2rem;
  margin-top: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #f0447f, #ff7ab1);
  color: #fff;
  box-shadow: 0 10px 20px rgb(240 68 127 / 0.24);
}

.doctor-check-icon svg {
  display: block;
  width: 1.2rem;
  height: 1.2rem;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.doctor-check-icon-dot {
  fill: currentColor;
  stroke: none;
}

.doctor-check p {
  margin: 0;
  color: #80344e;
  font-size: 1rem;
  font-weight: 850;
  line-height: 1.35;
}

.doctor-check span {
  display: block;
  margin-top: 0.12rem;
  color: color-mix(in srgb, #80344e 76%, var(--gray));
  font-size: 0.88rem;
  line-height: 1.4;
}

.doctor-check ul {
  display: grid;
  gap: 0.45rem;
  margin: 0;
  padding-left: 1.15rem;
}

.doctor-check li {
  margin: 0;
  padding-left: 0.08rem;
}

.doctor-check li::marker {
  color: #f0447f;
}

:root[saved-theme="dark"] .doctor-check {
  border-color: rgba(255, 122, 177, 0.38);
  background:
    linear-gradient(135deg, rgba(63, 30, 43, 0.78), rgba(28, 24, 27, 0.9)),
    radial-gradient(circle at 1rem 1rem, rgba(255, 122, 177, 0.16), transparent 42%),
    var(--light);
  box-shadow: 0 12px 28px rgb(0 0 0 / 0.22);
}

:root[saved-theme="dark"] .doctor-check p {
  color: #ffd6e5;
}

:root[saved-theme="dark"] .doctor-check span {
  color: color-mix(in srgb, #ffd6e5 70%, var(--gray));
}

@media all and (max-width: 800px) {
  .doctor-check {
    border-radius: 12px;
    padding: 0.95rem;
  }
}
`

export default (() => DoctorCheck) satisfies QuartzComponentConstructor
