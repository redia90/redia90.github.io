---
title: 유방암 AI 영상·디지털 진단 — DBT·AI 판독·CAD·디지털 병리
category: diagnosis-imaging
tags: [AI영상, AI진단, 디지털병리, DBT, 토모신세시스, CAD, 영상의학AI, 디지털병리AI, NCCN AI, 트라스파라, MASAI, ScreenPoint, Mirai, Volpara]
created: 2026-05-25
last_updated: 2026-06-28
sources:
  - "FDA AI/ML-Based Medical Devices Approved List. 2024."
  - "NCCN Breast Cancer Screening v1.2026 (AI Risk Models)."
  - "Lehman CD et al. AI for Mammography Screening. Radiology. 2024."
  - "McKinney SM et al. International evaluation of AI for breast cancer screening. Nature. 2020;577:89-94."
  - "Lång K et al. MASAI trial — AI-supported mammography screening. Lancet Oncol. 2023·2024 update."
  - "Yala A et al. Mirai — Robust breast cancer risk prediction. Sci Transl Med. 2021."
  - "Conant EF et al. Five-consecutive-year experience of DBT in mammography screening. Radiology. 2020."
  - "한국 식약처. 의료기기 AI 허가 데이터베이스."
  - "Lunit. INSIGHT MMG Clinical Validation Studies. 2023~2025."
confidence: medium
---

> 이 페이지는 **허브 문서**입니다. 세부 내용은 하위 문서를 참조하세요.

# 유방암 AI 영상·디지털 진단

## 개요
유방암 AI 영상 분석은 2020~2026년 빠르게 발전한 분야로, **유방촬영술 판독 보조·치밀유방 평가·DBT·디지털 병리·위험 예측**까지 임상에 도입되고 있다. 본 페이지는 AI 도구를 분야별로 정리하고 한국 도입 현황을 추적하는 허브이다. 영상 검사 기본은 [[유방암진단체계]]·[[유방암검진2026]], 정밀의학 통합은 [[정밀의학도구]] 참조.

---

## 하위 문서 목차

| 주제 | 페이지 | 핵심 내용 |
|------|--------|-----------|
| **AI 도구별 상세** | [[diagnosis-imaging/유방암AI영상_도구별\|AI 도구별 상세]] | 유방촬영술 AI·MASAI 임상시험·한국 코호트 검증·DBT·초음파 AI·MRI AI·디지털 병리 AI·HER2-low·위험예측모델·한국 식약처 허가·임상 적용 단계 |
| **환자 가이드** | [[diagnosis-imaging/유방암AI영상_환자가이드\|환자 가이드]] | 환자가 알면 도움되는 점·진료실 질문 10개·실전 동선 6단계·Q2 2026 한국 갱신·AI 윤리·안전 고려 |

---

## 빠른 참조 — AI 6개 영역 + 한국 현황

### AI 영상 도구 요약

| 영역 | 대표 도구 | 임상 활용 | 한국 도입 |
|------|------------|-----------|------------|
| **유방촬영술 AI 판독** | Lunit INSIGHT MMG, Vara, Transpara | 판독 보조 (BI-RADS 분류) | ✅ 일부 |
| **DBT (토모신세시스)** | Hologic 3D, GE Pristina | 치밀유방 정확도 ↑ | ✅ 일부 |
| **유방초음파 AI** | Koios DS, S-Detect | 양·악성 분류 | ✅ 일부 |
| **MRI AI** | QuantX, MRI-CAD | 의심 병변 자동 검출 | 임상시험 |
| **디지털 병리 AI** | Paige, Ibex, Lunit SCOPE | IHC 자동 판독·HER2 평가 | 일부 도입 |
| **AI 위험 예측** | Mirai (MIT), NCCN AI Risk | 5년 침습성 위험 | 연구 단계 |

### 한국 식약처 AI 허가 현황 (2026 요약)

| 제품 | 회사 | 분야 | 허가 시점 |
|------|------|------|------------|
| Lunit INSIGHT MMG | 루닛 | 유방촬영술 AI | 2019~ |
| Lunit INSIGHT DBT | 루닛 | DBT AI | 2024 |
| 메디컬AI 유방암 진단 | 메디칼AI | 초음파 AI | 진행 |
| 케이엠텍 디지털병리 AI | 케이엠텍 | 병리 AI | 2025 |

> 세부 내용 → [[diagnosis-imaging/유방암AI영상_도구별|AI 도구별 상세]] — 한국 임상 적용 단계·단점·실패 모드 포함

---

## 임상적 의의

- AI 영상은 **영상의학과 의사 인력 부족·번아웃 완화**에 기여
- 치밀유방 70% 한국 환자에서 DBT·AI 보조의 임상 가치 ↑
- HER2-low 판정 표준화 → ADC 치료 적응증 정확도 ↑ ([[HER2-low치료]])
- AI 위험 예측은 **개인 맞춤 검진**의 핵심 인프라
- 한국 AI 의료기기 산업 — 루닛·뷰노 등 글로벌 진출 사례
- 단독 판독은 아직 권고 아님 — 의사+AI 협업 표준

## 미해결 질문 / 연구 방향
> 💡 AI 단독 판독 표준화 — 영국 NHS 임상 후속
>    → **답변 (2026-05)**: **MASAI (Lancet Oncol 2023·2024 update)** 스웨덴 80,033명 RCT → 암 검출률 20%↑·판독 부담 44%↓·위양성 동등. 영국 NHS는 일부 권역 AI 단독 판독 시범 운영. 표준 진입 **2027~2028** 예상. 단독 판독은 아직 윤리·법적 검토 진행.
>
> 💡 한국 환자 코호트 검증 — Mirai·Tyrer-Cuzick
>    → **답변**: Lunit INSIGHT MMG 한국 데이터 학습 — AUC 0.88. Mirai 한국 검증 일부 진행 중 (서울대 코호트). Tyrer-Cuzick은 한국에서 정확도 ↓ — **KoBCRA Model** (한국형) 권장.
>
> 💡 AI 위양성·위음성 관리 표준
>    → **답변**: ACR·NCCN AI 가이드라인 (2024) — AI 결과는 의사 판독에 통합, 단독 사용 ❌. 위양성 → 영상의학과 재판독, 위음성 → 정기 추적 및 자가 관찰. AI 결과 모니터링·감사 표준 진행 중.
>
> 💡 의사 + AI 협업의 최적 워크플로우
>    → **답변**: MASAI 모델 (AI score 따라 1명 또는 2명 판독). RSNA·ACR이 워크플로우 가이드 발표 진행. 한국은 검진센터 도입 진행 — 영상의학과 인력 부족 완화 효과.
>
> 💡 AI 영상 보험 적용 확대 근거
>    → **답변**: 비용 효과성 연구 — **DBT + AI**가 단독 만모그래피 대비 ICER (Incremental Cost-Effectiveness Ratio) 합리적. 한국 심평원 평가 진행 중. 2027~ 일부 보험 적용 예상.
>
> 💡 한국 AI 의료기기 글로벌 진출 (루닛·뷰노)
>    → **답변**: **루닛 INSIGHT MMG** — FDA·CE·일본·EU 다국 승인. 글로벌 100+ 병원 도입. 뷰노 (Brain·기타) 일부. 글로벌 진출 시 학습 데이터 다양성·인종 보정이 핵심 — 한국 데이터로 학습한 모델의 글로벌 성능 추가 검증 필요.

## 주의사항
> ⚠️ AI 판독은 **의사 판독을 보완** — 단독 진단 근거 금지.
> ⚠️ AI 결과는 도구별로 정확도 차이 — FDA·식약처 승인 도구 사용 확인.
> ⚠️ 환자 본인이 AI 결과만으로 안심·불안하지 말 것. 최종 진단은 의사.

## 출처
- FDA AI/ML-Based Medical Devices Approved List. 2024.
- NCCN Breast Cancer Screening v1.2026 (AI Risk Models).
- Lehman CD et al. AI for Mammography Screening. Radiology. 2024.
- McKinney SM et al. International evaluation of AI for breast cancer screening. Nature. 2020;577:89-94.
- 한국 식약처. 의료기기 AI 허가 데이터베이스.

## 관련 개념
- [[유방암검진2026]] — AI 검진·치밀유방 검사
- [[diagnosis-imaging/유방영상검사가이드]] — **4가지 영상검사 비교(맘모·초음파·MRI·DBT)·BI-RADS·치밀유방·가돌리늄·MRI 적응증 — 영상 표준 가이드**
- [[유방암진단체계]] — 진단 검사 흐름 (영상 + 조직)
- [[유방암위험인자]] — AI 위험 평가 도구
- [[정밀의학도구]] — AI subtype·NCCN AI 통합·MASAI·Mirai·디지털 병리 AI entry 동선
- [[유방암면역_미생물군]] — sTIL 자동 판독 AI·PD-L1 CPS 디지털 병리
- [[유방암분자서브타입]] — AI subtype (LINUXtrial SNF)
- [[HER2-low치료]] — 병리 AI HER2 판정
- [[면역조직화학검사(IHC)]] — IHC 판독 AI
- [[2026임상연구업데이트]] — LINUXtrial AI subtype / DESTINY-Breast06 HER2-low 1차 도입 압력
- [[한국유방암통계]] — AI 검진 보급률 추적
- [[조직검사결과해석]] — **디지털 병리 AI HER2 IHC 0/1+ 경계 판정·재검사 동선 영향 — HER2-low 적응증 정확도 결정**

## 업데이트 히스토리
- 2026-05-25: 신규 생성 (library-check 보강 추천) — AI 영상 6개 영역, 한국 식약처 AI 허가 현황, 진료실 질문
- 2026-05-27: 대폭 보강 — MASAI 임상시험 (스웨덴 80,033명 RCT), AI 실패 모드 6종, 한국 환자 코호트 검증, HER2-low 디지털 병리 AI 가치, 위험 모델 5종 비교표, AI 윤리·안전 추가
- 2026-06-02: Q2 2026 한국 AI 영상 적용 갱신 섹션 — 루닛 INSIGHT 4종 도입 변화, MASAI 후속, KoBCRA 한국형 위험 평가, 디지털 병리 AI HER2-low/ultralow 정확도
- 2026-06-28: 허브 문서로 재편 — 도구별 상세([[유방암AI영상_도구별]])·환자 가이드([[유방암AI영상_환자가이드]])로 분리, 빠른 참조 표 및 하위 목차 추가
