const terms = [
  [
    "HER2-ultralow",
    "HER2가 극미량 보이는 최신 분류 개념입니다. 표준 치료와 보험 적용은 계속 정리되는 중입니다.",
  ],
  [
    "HER2-low",
    "HER2가 아주 높지는 않지만 일부 발현되는 상태입니다. 일부 전이성 유방암 치료 선택과 연결될 수 있습니다.",
  ],
  [
    "HER2",
    "암세포 성장 신호와 관련된 단백질입니다. 양성이면 HER2 표적치료가 중요한 선택지가 됩니다.",
  ],
  ["ER", "에스트로겐 수용체입니다. 양성이면 호르몬 치료가 치료 계획에 포함되는 경우가 많습니다."],
  ["PR", "프로게스테론 수용체입니다. ER과 함께 호르몬 수용체 양성 여부를 판단할 때 봅니다."],
  [
    "Ki-67",
    "암세포가 얼마나 빠르게 나뉘는지 보는 증식 지표입니다. 수치 하나만으로 치료를 결정하지는 않습니다.",
  ],
  [
    "PD-L1 CPS",
    "PD-L1 양성을 계산하는 점수 방식 중 하나입니다. TNBC에서 면역항암제 사용 가능성을 볼 때 나옵니다.",
  ],
  ["PD-L1", "면역항암제 사용 가능성을 평가할 때 보는 면역 관련 표지자입니다."],
  ["TNM", "T는 종양 크기, N은 림프절 전이, M은 원격 전이를 뜻하는 병기 표현입니다."],
  ["DBT", "유방을 여러 각도에서 촬영해 얇은 단면처럼 보는 3D 유방촬영 기술입니다."],
  ["CAD", "영상 판독 때 의심 부위를 표시하거나 위험도를 보조하는 컴퓨터·AI 도구입니다."],
  [
    "디지털 병리",
    "현미경 슬라이드를 디지털 이미지로 바꿔 병리 판독과 AI 분석에 활용하는 방식입니다.",
  ],
  ["MRI", "자석과 전파로 유방이나 전신 상태를 더 자세히 보는 검사입니다."],
  ["CT", "X-ray를 여러 방향에서 찍어 몸 안을 단면으로 보는 검사입니다."],
  ["IHC", "면역조직화학검사입니다. 조직 염색으로 ER, PR, HER2, Ki-67 같은 표지자를 확인합니다."],
  [
    "FISH",
    "HER2 유전자 증폭 여부를 확인하는 검사입니다. HER2 IHC 2+처럼 애매할 때 자주 언급됩니다.",
  ],
  ["NGS", "여러 유전자를 한 번에 분석해 치료 표적이나 변이를 찾는 검사입니다."],
  ["CDx", "특정 표적치료제를 쓸 수 있는지 판단하기 위해 함께 쓰는 동반진단 검사입니다."],
  [
    "BRCA1",
    "DNA 복구와 관련된 유전자입니다. 병적 변이가 있으면 유방암·난소암 위험과 치료 선택에 영향을 줄 수 있습니다.",
  ],
  [
    "BRCA2",
    "DNA 복구와 관련된 유전자입니다. 병적 변이가 있으면 유방암·난소암 위험과 치료 선택에 영향을 줄 수 있습니다.",
  ],
  ["BRCA", "DNA 복구와 관련된 유전자군입니다. 유전상담과 PARP 억제제 논의에서 자주 나옵니다."],
  ["VUS", "유전자 변이가 발견됐지만 병적 의미가 확정되지 않은 결과입니다."],
  [
    "PTEN",
    "세포 성장 신호를 조절하는 유전자입니다. 일부 암에서 변이와 치료 반응 연구가 연결됩니다.",
  ],
  ["TNBC", "ER, PR, HER2가 모두 음성인 트리플 네거티브 유방암입니다."],
  ["DCIS", "암세포가 유관 안에 머무는 상피내암입니다. 침윤성 유방암과 치료 판단이 다릅니다."],
  ["IDC", "유관에서 시작해 주변 조직으로 침윤한 침습성 유관암입니다."],
  ["LVI", "림프혈관침윤입니다. 암세포가 림프관이나 혈관 안에서 보인다는 뜻입니다."],
  ["pCR", "수술 전 치료 후 수술 조직에서 침습성 암이 보이지 않는 병리학적 완전관해입니다."],
  [
    "Oncotype DX",
    "일부 조기 호르몬 양성 유방암에서 항암 필요성을 판단할 때 쓰는 유전자 검사입니다.",
  ],
  [
    "RSClin",
    "Oncotype DX 점수에 나이, 종양 크기, 등급 같은 임상 변수를 더해 위험도를 보정하는 도구입니다.",
  ],
  [
    "TAILORx",
    "Oncotype DX 점수에 따라 조기 호르몬 양성 유방암에서 항암 필요성을 평가한 대형 임상시험입니다.",
  ],
  [
    "RxPONDER",
    "림프절 1~3개 양성인 일부 호르몬 양성 유방암에서 RS 점수와 항암 이득을 평가한 임상시험입니다.",
  ],
  ["PARP 억제제", "BRCA 변이 등 DNA 복구 약점을 이용하는 표적치료제 계열입니다."],
  ["CDK4/6 억제제", "호르몬 양성 유방암에서 암세포 증식 신호를 막는 표적치료제 계열입니다."],
  ["ADC", "항체-약물 접합체입니다. 암세포를 찾는 항체에 항암제를 붙인 치료제입니다."],
  ["PROTAC", "표적 단백질을 분해하도록 유도하는 신약 플랫폼입니다."],
  ["Trop-2", "일부 유방암 세포 표면에 많이 보이는 단백질이며 ADC 표적으로 언급됩니다."],
  ["OFS", "폐경 전 환자에서 난소 기능을 억제하는 치료 전략입니다."],
  ["GnRH 작용제", "난소 기능을 일시적으로 억제하는 주사제 계열입니다."],
  ["SERM", "에스트로겐 수용체에 작용해 유방암 성장을 억제하는 호르몬제 계열입니다."],
  ["TCHP", "HER2 양성 유방암에서 쓰이는 대표적 수술 전 항암 조합 중 하나입니다."],
  ["PMRT", "유방절제술 뒤 흉벽이나 림프절 부위에 시행하는 방사선치료입니다."],
  ["DIBH", "왼쪽 유방 방사선치료 때 심장 노출을 줄이기 위한 깊은 들숨 숨참기 기법입니다."],
  ["LVA", "막힌 림프 흐름을 정맥으로 우회시키는 림프부종 수술 방법입니다."],
  ["VLNT", "림프절 조직을 옮겨 림프 흐름 회복을 돕는 림프부종 수술입니다."],
  ["KEYNOTE-522", "고위험 조기 TNBC에서 키트루다를 수술 전후 치료에 더한 임상시험입니다."],
  [
    "KEYNOTE-355",
    "전이성 TNBC에서 PD-L1 CPS 조건에 따라 키트루다 병용 효과를 평가한 임상시험입니다.",
  ],
  [
    "OlympiA",
    "BRCA 변이가 있는 고위험 HER2 음성 조기 유방암에서 올라파립 보조요법을 본 임상시험입니다.",
  ],
  ["NATALEE", "조기 호르몬 양성 HER2 음성 유방암에서 리보시클립 보조요법을 평가한 임상시험입니다."],
  [
    "monarchE",
    "고위험 조기 호르몬 양성 HER2 음성 유방암에서 아베마시클립 보조요법을 평가한 임상시험입니다.",
  ],
  ["DESTINY-Breast", "엔허투 등 HER2 관련 ADC를 평가한 임상시험 시리즈입니다."],
  ["ASCENT", "전이성 TNBC에서 트로델비 효과를 평가한 대표 임상시험입니다."],
  ["EMT", "암세포가 더 이동하기 쉬운 성질로 바뀌는 전이 관련 과정입니다."],
  ["MET", "전이 부위에서 암세포가 다시 자리를 잡기 쉬운 상태로 바뀌는 과정입니다."],
  ["CTC", "혈액 속을 떠다니는 암세포입니다. 전이와 치료 반응 연구에서 언급됩니다."],
  ["Prrx1", "전이와 암세포 휴면 연구에서 언급되는 전사인자입니다. 일반 진료용 검사는 아닙니다."],
  ["PABC", "임신 중 또는 출산 전후 일정 기간에 진단되는 임신 관련 유방암입니다."],
  ["CGA", "고령 환자의 기능, 인지, 영양, 동반 질환 등을 종합 평가하는 방식입니다."],
  ["G8", "고령 암 환자에서 정밀 노인 평가가 필요한지 가늠하는 선별 도구입니다."],
  [
    "de-escalation",
    "치료 효과를 유지하면서 부작용과 부담을 줄이기 위해 치료 강도를 낮추는 전략입니다.",
  ],
  ["완화의료", "완치 가능성과 관계없이 통증, 불안, 돌봄 부담 같은 고통을 줄이는 의료입니다."],
  [
    "호스피스",
    "임종기에 가까운 환자의 증상 완화와 삶의 질을 중심으로 돌보는 의료·돌봄 체계입니다.",
  ],
  [
    "VRE",
    "반코마이신이라는 항생제에 내성이 있는 장알균입니다. 입원 전 감염 관리 확인에서 언급될 수 있습니다.",
  ],
  [
    "QTc 연장",
    "심전도에서 심장 전기 회복 시간이 길어지는 현상으로 일부 약제에서 모니터링이 필요합니다.",
  ],
  ["병기", "암의 진행 정도입니다. 유방암은 크기, 림프절, 전이, 수용체 정보 등을 함께 봅니다."],
  [
    "림프절",
    "면역세포가 모이는 작은 기관입니다. 유방암에서는 겨드랑이 림프절 전이 여부가 중요합니다.",
  ],
  [
    "절제연",
    "수술로 떼어낸 조직의 가장자리입니다. 암이 가장자리까지 있는지 여부가 추가 치료에 영향을 줄 수 있습니다.",
  ],
  ["림프혈관침윤", "암세포가 림프관이나 혈관 안에서 보인다는 병리 소견입니다."],
  [
    "신보조요법",
    "수술 전에 먼저 시행하는 치료입니다. 암 크기를 줄이고 반응을 확인하는 목적이 있습니다.",
  ],
  ["보조요법", "수술 후 재발 위험을 낮추기 위해 시행하는 치료입니다."],
  ["전이", "암이 처음 생긴 곳을 넘어 림프절이나 다른 장기로 퍼진 상태입니다."],
  ["재발", "치료 후 암이 다시 확인되는 상태입니다. 위치에 따라 국소 재발과 원격 재발로 나눕니다."],
] as const

const skipSelector = [
  "a",
  "button",
  "code",
  "pre",
  "kbd",
  "samp",
  "script",
  "style",
  "textarea",
  "input",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  ".glossary-term",
  ".doctor-check",
  ".doc-difficulty",
].join(",")

let popup: HTMLElement | null = null
let activeTerm: HTMLElement | null = null

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function isAsciiWordChar(value: string | undefined) {
  return !!value && /[A-Za-z0-9_]/.test(value)
}

type TermMatch = {
  index: number
  text: string
}

function findTermMatch(text: string, term: string): TermMatch | undefined {
  const pattern = new RegExp(escapeRegExp(term), "i")
  const match = text.match(pattern)
  if (!match || match.index === undefined) return undefined

  const previousChar = text[match.index - 1]
  const nextChar = text[match.index + match[0].length]
  const isShortAsciiTerm = /^[A-Za-z0-9+-/]+$/.test(term) && term.length <= 5

  if (isShortAsciiTerm && (isAsciiWordChar(previousChar) || isAsciiWordChar(nextChar))) {
    const rest = text.slice(match.index + 1)
    const nextMatch: TermMatch | undefined = findTermMatch(rest, term)
    if (!nextMatch) return undefined
    return {
      index: match.index + 1 + nextMatch.index,
      text: nextMatch.text,
    }
  }

  return {
    index: match.index,
    text: match[0],
  }
}

function ensurePopup() {
  if (popup) return popup

  popup = document.createElement("div")
  popup.className = "glossary-popup"
  popup.setAttribute("role", "dialog")
  popup.setAttribute("aria-live", "polite")
  document.body.appendChild(popup)
  return popup
}

function getGlossaryHref() {
  return new URL("/glossary/용어사전", window.location.origin).toString()
}

function hidePopup() {
  activeTerm?.classList.remove("is-active")
  activeTerm = null
  popup?.classList.remove("is-visible")
}

function positionPopup(anchor: HTMLElement, popover: HTMLElement) {
  const rect = anchor.getBoundingClientRect()
  const gap = 10
  const preferredTop = rect.bottom + gap
  const maxLeft = window.innerWidth - popover.offsetWidth - 12
  const left = Math.max(12, Math.min(rect.left, maxLeft))
  const wouldOverflowBottom = preferredTop + popover.offsetHeight > window.innerHeight - 12
  const top = wouldOverflowBottom
    ? Math.max(12, rect.top - popover.offsetHeight - gap)
    : Math.max(12, preferredTop)

  popover.style.left = `${left}px`
  popover.style.top = `${top}px`
}

function showPopup(anchor: HTMLElement) {
  const term = anchor.dataset.term ?? ""
  const definition = anchor.dataset.definition ?? ""
  const popover = ensurePopup()

  activeTerm?.classList.remove("is-active")
  activeTerm = anchor
  activeTerm.classList.add("is-active")

  popover.innerHTML = `
    <p class="glossary-popup-title">${term}</p>
    <p class="glossary-popup-desc">${definition}</p>
    <a class="glossary-popup-link internal" href="${getGlossaryHref()}">용어사전에서 더 보기</a>
  `

  popover.classList.add("is-visible")
  positionPopup(anchor, popover)
}

function attachPopupEvents(scope: ParentNode) {
  const onClick = (event: Event) => {
    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLElement>(".glossary-term")
    if (!button || !scope.contains(button)) return

    event.preventDefault()
    event.stopPropagation()

    if (button === activeTerm && popup?.classList.contains("is-visible")) {
      hidePopup()
      return
    }

    showPopup(button)
  }

  const onMouseOver = (event: Event) => {
    if (!window.matchMedia("(hover: hover)").matches) return

    const target = event.target as HTMLElement | null
    const button = target?.closest<HTMLElement>(".glossary-term")
    if (!button || !scope.contains(button) || button === activeTerm) return

    showPopup(button)
  }

  scope.addEventListener("click", onClick, true)
  scope.addEventListener("mouseover", onMouseOver)

  window.addCleanup(() => {
    scope.removeEventListener("click", onClick, true)
    scope.removeEventListener("mouseover", onMouseOver)
  })
}

function wrapTerms(article: HTMLElement) {
  if (document.body.dataset.slug?.startsWith("glossary/")) return

  const usedTerms = new Set<string>()
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement
      if (!parent || parent.closest(skipSelector)) return NodeFilter.FILTER_REJECT
      if (!node.nodeValue?.trim()) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })

  const nodes: Text[] = []
  while (nodes.length < 280) {
    const next = walker.nextNode()
    if (!next) break
    nodes.push(next as Text)
  }

  for (const node of nodes) {
    if (usedTerms.size >= 16) break

    const text = node.nodeValue ?? ""
    const matched = terms.find(([term]) => !usedTerms.has(term) && findTermMatch(text, term))
    if (!matched) continue

    const [term, definition] = matched
    const match = findTermMatch(text, term)
    if (!match) continue

    const before = text.slice(0, match.index)
    const matchedText = match.text
    const after = text.slice(match.index + matchedText.length)
    const fragment = document.createDocumentFragment()

    if (before) fragment.appendChild(document.createTextNode(before))

    const button = document.createElement("button")
    button.type = "button"
    button.className = "glossary-term"
    button.dataset.term = term
    button.dataset.definition = definition
    button.textContent = matchedText
    button.setAttribute("aria-label", `${term} 용어 설명 보기`)
    fragment.appendChild(button)

    if (after) fragment.appendChild(document.createTextNode(after))

    node.parentNode?.replaceChild(fragment, node)
    usedTerms.add(term)
  }
}

function initGlossaryPopups() {
  hidePopup()
  popup?.remove()
  popup = null

  const article = document.querySelector("article")
  if (!(article instanceof HTMLElement)) return

  wrapTerms(article)
  attachPopupEvents(article)

  const onDocumentClick = (event: Event) => {
    const target = event.target as HTMLElement | null
    if (target?.closest(".glossary-popup, .glossary-term")) return
    hidePopup()
  }

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === "Escape") hidePopup()
  }

  const onScrollOrResize = () => {
    if (activeTerm && popup?.classList.contains("is-visible")) positionPopup(activeTerm, popup)
  }

  document.addEventListener("click", onDocumentClick)
  document.addEventListener("keydown", onKeydown)
  window.addEventListener("scroll", onScrollOrResize, { passive: true })
  window.addEventListener("resize", onScrollOrResize)

  window.addCleanup(() => {
    document.removeEventListener("click", onDocumentClick)
    document.removeEventListener("keydown", onKeydown)
    window.removeEventListener("scroll", onScrollOrResize)
    window.removeEventListener("resize", onScrollOrResize)
    hidePopup()
    popup?.remove()
    popup = null
  })
}

document.addEventListener("nav", initGlossaryPopups)
