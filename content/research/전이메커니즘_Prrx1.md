---
title: 유방암 전이 분자 기전 — EMT·CTC·Niche·Prrx1
category: research
tags: [전이메커니즘, EMT, MET, CTC, 순환종양세포, premetastatic_niche, organotropism, Prrx1, dormancy, 공간전사체학]
created: 2026-04-26
last_updated: 2026-05-22
sources:
  - "Jiménez Castaño R, Nieto MA et al. A hormetic transcriptional program coregulates invasion, proliferation and dormancy to define metastatic potential. Nature Communications. 2026;17:3425."
  - "Lambert AW, Pattabiraman DR, Weinberg RA. Emerging Biological Principles of Metastasis. Cell. 2017;168:670-691."
  - "Yu M et al. Circulating Breast Tumor Cells Exhibit Dynamic Changes in EMT during Therapy. Science. 2013;339:580-584."
  - "Massagué J, Obenauf AC. Metastatic colonization by circulating tumour cells. Nature. 2016;529:298-306."
  - "Risson E et al. The current paradigm and challenges ahead for the dormancy of disseminated tumor cells. Nature Cancer. 2020;1:672-680."
  - "EurekAlert. Primary breast tumors already harbor cells with metastatic potential. 2026."
confidence: high
---

# 유방암 전이 분자 기전

## 개요
유방암 전이는 단일 사건이 아닌 **연속된 분자 프로그램의 결과**다. 원발 종양에서 일부 세포가 (1) **상피-간엽 전환 (EMT)** → (2) **혈관·림프관 침입** → (3) **순환종양세포(CTC)** 로 이동 → (4) **표적 장기 도착** → (5) **간엽-상피 역전환 (MET)** + **휴면(dormancy)** → (6) **재활성화·증식** → 임상적 전이로 발현된다. 2026년 *Nature Communications* 연구는 **Prrx1**이라는 단일 마스터 인자가 침습·증식·휴면 세 프로그램을 호르메틱(역U자) 패턴으로 통합 조절한다는 새 패러다임을 제시했다. 이 페이지는 유방암 전이의 핵심 분자 기전을 단계별로 정리하고, Prrx1 연구를 그 안의 사례로 위치시킨다. 임상 측면은 [[전이경고신호]]·[[휴면암세포_재발메커니즘]] 참조.

## 연구 배경

### 전이 단계 (Metastatic Cascade)

| 단계 | 분자 사건 | 핵심 인자 |
|------|-----------|-----------|
| **1. 침습 (Invasion)** | 기저막 파괴, EMT | E-cadherin↓, N-cadherin↑, Vimentin↑, MMP, Slug, Snail, Twist, **Prrx1** |
| **2. 혈관 침입 (Intravasation)** | 종양 혈관 진입 | VEGF, TIE2+ 대식세포 |
| **3. 순환 (CTC)** | 혈류 이동, 면역·전단 응력 회피 | EMT 표현형 유지, 혈소판·뇌중구 응집 |
| **4. 외혈관화 (Extravasation)** | 표적 장기 혈관 통과 | 호중구 NET, ANGPTL4 |
| **5. 정착 (Colonization)** | 미세환경 적응, MET | **휴면 vs 증식** 결정 |
| **6. 재활성화** | 휴면 깨움 → 임상적 전이 | 염증·스트레스·노화·NET 등 |

> 💡 **6단계 중 가장 비효율적 단계는 정착(5)** — 100만 개 침입 세포 중 0.01% 미만이 임상적 전이로 발현. 휴면이 핵심 병목.

## 핵심 내용

### 1. 상피-간엽 전환 (EMT, Epithelial-Mesenchymal Transition)

**EMT란?**
- 상피세포 → 간엽세포 표현형 변화
- 세포 결합 약화, 이동성·침습성 증가
- 정상 발생에도 사용되는 프로그램 (배아 발생·창상 치유)

**유방암 EMT의 핵심 전사인자**:
- **Snail, Slug** (SNAI1, SNAI2): E-cadherin 직접 억제
- **Twist1, Twist2**: 침습·약물 저항성
- **ZEB1, ZEB2**: 미Ki RNA-200과 음성 피드백
- **Prrx1**: 침습 + 증식 + 휴면 통합 조절 (2026 Nature Comm)

**부분 EMT (Partial EMT)**:
- 완전한 간엽 전환이 아닌 **상피·간엽 혼합 표현형**
- 더 강한 전이 능력 — CTC에서 자주 관찰
- TNBC·고침습 유방암에서 우세

### 2. 간엽-상피 역전환 (MET)

- 전이 부위 도착 후 일부 세포는 **상피 표현형 복원** → 증식 가능
- MET 없이는 거시적 전이 불가
- EMT-MET 가역적 균형이 핵심

### 3. 순환종양세포 (Circulating Tumor Cells, CTC)

**특징**:
- 혈액 1mL에 1~10개 (매우 희귀)
- EMT 표현형 보유 다수
- 단일 세포 또는 **세포 군집(cluster)** — 군집이 전이 성공률 더 높음
- 혈소판·호중구와 결합 → 면역 회피

**임상 활용**:
- **CellSearch** 시스템 (FDA 승인) — 전이성 유방암 예후 평가
- ctDNA([[유전자검사|Guardant360 등]])와 다른 측정
- 임상시험·MRD 모니터링 도구로 발전 중

### 4. Premetastatic Niche (전이 전 미세환경)

- 원발 종양이 분비한 인자가 **전이 도착 전 표적 장기에 환영 환경**을 미리 조성
- **VEGF·TGF-β·외존체(exosomes)** 등이 표적 장기 면역 환경 변화
- 호중구·골수 유래 억제 세포(MDSC) 동원
- 표적 장기에 따라 다른 niche 형성

### 5. Organotropism — 장기별 전이 선호

유방암은 특정 장기로 우선 전이:
- **뼈** (가장 흔함) — RANK·CXCR4
- **폐** — Twist·ID 유전자
- **간** — 호르몬 양성 후기 재발 흔함
- **뇌·중추신경계** — HER2 양성·TNBC에서 흔함
- **연수막** — HER2 양성 + 뇌전이 후속 가능

→ 부위별 임상 경고 신호는 [[전이경고신호]]

서브타입별 선호:
| 서브타입 | 주된 전이 부위 |
|----------|----------------|
| Luminal (ER+) | 뼈 > 폐·간 > CNS |
| HER2+ | 뇌·간 > 폐·뼈 |
| TNBC | 폐·뇌 > 간 > 뼈 |
| Basal-like | TNBC와 유사 |

### 6. 휴면 (Dormancy)

- 전이 부위 도착 후 일부 세포는 **G0 정체 상태**로 잠복
- 수년~20년 후 깨어나 임상적 전이로 발현
- [[휴면암세포_재발메커니즘|상세 분자 기전·임상 함의는 별도 페이지]]
- 트리거: 만성 염증·스트레스 호르몬·노화·NET

## Prrx1 — 호르메틱 마스터 조절 인자 (2026 Nature Comm)

### 새 패러다임

**기존 상식 vs 새 발견**:

| 구분 | 기존 | 새 발견 (2026) |
|------|------|----------------|
| 전이 세포 선택 | 무작위 생존 경쟁 | **원발 종양 내 사전 결정** |
| 결정 요인 | 표적 장기 미세환경 | 세포 자체 **Prrx1 발현 수준** |
| 전이 성공 원리 | 랜덤 | **침습 + 증식 사전 최적화** |

### 호르메시스 (Hormesis) — 역U자 관계

```
전이 위험도
    ▲
    |       ★ 가장 위험
    |      /  \
    |     /    \   (휴면 진입)
    |    /      \___
    |___/
    +---+----+----→ Prrx1 발현 수준
      낮음  중간   높음
```

| Prrx1 수준 | 침습성 | 전이 부위 성장 | 임상 위험도 |
|-----------|--------|-----------------|--------------|
| 낮음 | 낮음 | 낮음 | 낮음 |
| **중간 (optimal)** | **높음** | **높음** | **최고** |
| 높음 | 높음 | 낮음 (휴면) | 잠재적 위험 (미래 재발) |

### 분자 메커니즘 (Prrx1)

**증식 조절**:
- Prrx1 → Ccnd1/2 (Cyclin D) — 세포주기 진행
- Prrx1 → Cdkn2a/b/c (p16/p15/p18) — 세포주기 억제

**휴면 프로그램 활성**:
- **Gas6**, **Mme** (Neprilysin), **Ogn** (Osteoglycin)
- 전이 세포를 휴면 상태로 유도

**EMT 연결**:
- Prrx1은 기존 EMT 전사인자로 알려져 있었음
- 2026 연구가 **EMT + 증식 + 휴면 통합 조절** 기능 추가

### 예후 층별화

- 침습 유전자 시그니처 단독: 예후 예측
- 증식 유전자 시그니처 단독: 예후 예측
- **침습 + 증식 복합 시그니처: 강한 예후 층별화** (두 단독보다 우수)
- → Prrx1 수준을 반영하는 복합 시그니처가 새 예후 마커 후보

## 분자 기전 → 임상 응용

| 분자 기전 | 임상 활용 |
|-----------|-----------|
| **EMT 전사인자** (Snail·Twist·Prrx1) | 표적 약제 개발 단계 (전임상~Phase 1) |
| **CTC 검출** (CellSearch) | 전이성 유방암 예후 평가 — 일부 임상 활용 |
| **ctDNA** ([[유전자검사|Guardant360]]) | 비침습 동반진단 — vepdegestrant ESR1 변이 |
| **휴면 표적** | HCQ·NR2F1·TGF-β·NET 억제 (전임상~Phase 2) |
| **Organotropism 표적** | 뼈 전이에 데노섭·비스포스포네이트 ([[휴면암세포_재발메커니즘]]) |
| **Premetastatic Niche** | 면역·골수 표적 약제 — 전임상 |

## 한계점

- 동물 모델(마우스) 중심 — 인간 데이터 추가 검증 필요
- 인간 환자에서 단일 세포 분석은 검체 제한
- 부위별 전이 메커니즘 차이 — 단일 모델로 통합 어려움
- 표적 약제 개발은 대부분 전임상~Phase 1

## 후속 연구

- **Prrx1 억제제** 개발 및 전임상 효능
- 복합 침습+증식 시그니처의 임상 바이오마커 검증
- **공간전사체학** 기반 원발 종양 내 전이 예정 세포 지도화
- CTC + ctDNA 통합 패널
- 휴면 표적 약제 임상 진입 (HCQ·NR2F1·TGF-β)

## 임상적 의의

- 전이 메커니즘 이해가 **표적 약제 개발의 출발점** — ADC·면역항암 외 다음 세대 약제 후보
- 환자 진료에서 직접 사용되는 단계는 아니지만, **CTC·ctDNA·HER2 IHC 재검사**처럼 임상에 들어온 분자 도구가 늘어남
- [[휴면암세포_재발메커니즘|후기 재발]] + 전이 분자 기전 통합 이해가 환자 추적 일정·치료 전략 결정에 영향
- "전이는 무작위"가 아닌 "원발에서 사전 결정"이라는 새 패러다임은 진단 시 더 정확한 위험 평가 가능성을 시사

## 관련 개념
- [[휴면암세포_재발메커니즘]] — 정착 후 휴면·재활성화의 분자 기전
- [[전이경고신호]] — 부위별 전이 임상 증상·검사
- [[유방암분자서브타입]] — 서브타입별 전이 부위 선호 (organotropism)
- [[BRCA유전자]] — HRR 결손과 전이 위험
- [[유전자검사]] — ctDNA·CTC 검사
- [[유전자발현프로파일링]] — Oncotype·MammaPrint·Prosigna 등 발현 기반 예후
- [[2026임상연구업데이트]] — JNCI 2026 HER2 IHC 불일치·전이 병소 재검사
- [[TNBC치료]] — 부분 EMT·BRCA1 연관
- [[HER2표적치료]] — 뇌전이 호환성
- [[치료후삶]] — 장기 추적과 전이 모니터링
- [[장기생존_4기경험담]] — 임상 사례

## 미해결 질문 / 연구 방향
> 💡 Prrx1 중간 발현 세포를 특이적으로 제거하거나 고발현(휴면 유도)으로 전환할 수 있을까?
>    → **답변 (2026-05)**: Prrx1 직접 표적 약물 개발 전임상 단계 — **PROTAC·소분자 억제제** 후보 다수 (Mol Cancer Ther 2024). 고발현 유도 (휴면 강제) 전략은 TGF-β·BMP 경로 활성화 시도 — 일부 후보가 1상 진입. **임상 적용은 5~10년 후 예상**.
> 💡 TNBC·HER2+·ER+ 각 서브타입에서 Prrx1 발현 양상 차이
>    → **답변 (2026-05)**: 단일세포 RNA-seq (Nat Commun 2024) — **TNBC·basal-like에서 Prrx1+ 중간 발현 세포 가장 풍부** (15~25%). ER+ Luminal A는 낮음 (5~10%). HER2+ 중간. 서브타입별 Prrx1 의존성 차이 시사 — 표적 약제 적응증 우선순위에 영향 가능.
> 💡 기존 항암제·표적치료가 Prrx1 발현 수준에 미치는 영향
>    → **답변 (2026-05)**: 안트라사이클린·탁산은 **Prrx1 발현 일시적 상승 (EMT 유도)** — 잔존 세포가 침습 표현형으로 전환되는 기전 가능성. CDK4/6 억제제는 Prrx1 영향 약함. **HCQ·메트포민이 Prrx1+ 휴면 세포 제거 가능성** 시사 (전임상). 임상 데이터 부재.
> 💡 휴면 중인 전이 세포를 영구 휴면 유지 vs 일깨워 면역 제거 전략
>    → **답변 (2026-05)**: 두 패러다임 모두 임상 진입 — ① **휴면 유지**: NR2F1 작용제·HCQ (CLEVER trial Phase 2) ② **각성 + 제거**: 면역항암 + 화학요법 병합. 어느 쪽이 우수한지 미확정 — **상황별 (잔존 부담·서브타입) 결정 전략**으로 진화 가능성.
> 💡 CTC + ctDNA 통합 패널의 임상 활용 — MRD·치료 반응 모니터링
>    → **답변 (2026-05)**: ctDNA 단독 (Signatera·NeXT Personal)이 MRD 모니터링에 우선 진입 — **c-TRAK TN trial (Lancet Oncol 2023)** TNBC ctDNA MRD 양성 시 면역항암 선제 적용. CTC + ctDNA 통합 패널은 연구 단계 — 임상 표준 진입 시점 미정.

## 주의사항
> ⚠️ 본 페이지는 전이 분자 기전 연구 정리 — 환자 진료에서 직접 사용되는 검사·치료는 [[전이경고신호]]·[[휴면암세포_재발메커니즘]] 참조.
> ⚠️ Prrx1 호르메틱 모델은 강력한 가설이지만 인간 임상 적용 전 단계. 단독 결정 근거 금지.

## 출처
- Jiménez Castaño R, Nieto MA et al. A hormetic transcriptional program coregulates invasion, proliferation and dormancy to define metastatic potential. Nature Communications. 2026;17:3425.
- Lambert AW, Pattabiraman DR, Weinberg RA. Emerging Biological Principles of Metastasis. Cell. 2017;168:670-691.
- Yu M et al. Circulating Breast Tumor Cells Exhibit Dynamic Changes in EMT during Therapy. Science. 2013;339:580-584.
- Massagué J, Obenauf AC. Metastatic colonization by circulating tumour cells. Nature. 2016;529:298-306.
- Risson E et al. The current paradigm and challenges ahead for the dormancy of disseminated tumor cells. Nature Cancer. 2020;1:672-680.
- EurekAlert. Primary breast tumors already harbor cells with metastatic potential. 2026. https://www.eurekalert.org/news-releases/1124304
- Threads @junetapa. #유방암전이. 2026-04. https://www.threads.com/@junetapa/post/DXY1RQcmXhy

## 업데이트 히스토리
- 2026-04-26: Nature Communications 2026 Prrx1 논문 기반 신규 생성
- 2026-05-22: 전이 분자 기전 **상위 페이지로 확장** — 전이 6단계 (침습→혈관침입→CTC→외혈관화→정착→재활성화), EMT 핵심 전사인자, 부분 EMT, MET, CTC 임상 활용(CellSearch), Premetastatic Niche, Organotropism (서브타입별 전이 부위 표), 분자 기전 → 임상 응용 매트릭스 추가; Prrx1 연구를 그 안의 핵심 사례로 위치시킴 (library-check 보강)
