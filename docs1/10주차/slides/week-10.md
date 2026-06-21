---
marp: true
theme: default
paginate: true
size: 16:9
header: "Vibe Coding Project — Session 2 / Planning"
footer: "© 2026 Project Kickoff"
style: |
  section {
    padding: 56px 64px 92px;
    font-size: 28px;
    line-height: 1.32;
  }

  h1 {
    font-size: 1.85em;
  }

  h2 {
    font-size: 1.45em;
    margin-bottom: 0.55em;
  }

  ul,
  ol {
    margin-top: 0.25em;
    margin-bottom: 0.25em;
  }

  li {
    margin: 0.18em 0;
  }

  table {
    font-size: 21px;
    line-height: 1.24;
  }

  pre {
    font-size: 23px;
    line-height: 1.22;
  }

  blockquote {
    font-size: 0.92em;
  }

  header,
  footer,
  section::after {
    font-size: 17px;
  }

  footer {
    bottom: 22px;
  }

  section::after {
    bottom: 22px;
  }
---

# 세션 2 — 기획 & 일정 수립

> 이번 세션 전부를 **AI Agent에게 맡기되**,
> 산출물을 **본인이 모두 이해하고 설명할 수 있어야** 합니다.

---

## 오늘의 목표

세션이 끝날 때 본인 리포지토리에 다음이 있어야 합니다.

1. `.planning/00-vision.md` — 비전·목표
2. `.planning/01-requirements.md` — 요구사항
3. `.planning/02-wbs.md` — Work Breakdown Structure
4. `.planning/04-schedule.md` — 6주 일정 (10~14주차)
5. `BONUS.md` 초안 — 가산점 신청 트래킹

---

## 1. 기획의 흐름 (AI Agent와 함께)

```
주제 한 줄
  ↓
AI Agent에게 "비전·문제 정의" 요청
  ↓
사용자 시나리오 3개 도출
  ↓
요구사항 MoSCoW 분류
  ↓
WBS 분해 (3단계)
  ↓
6주 일정으로 매핑
  ↓
위험 식별 + 대응
```

---

## 2. AI Agent 호출 예시 — 1단계

```
나는 [한 줄 주제]를 만들고 싶다.

1) 비전과 목표를 .planning/00-vision.md에 작성
2) 핵심 사용자 시나리오 3개를 .planning/01-requirements.md에 작성
3) 기능을 MoSCoW(Must/Should/Could/Won't)로 분류
4) 모호한 부분은 나에게 선택형 질문으로 물어본 후 작성
```

> 자세한 프롬프트 모음 → `9주차/resources/05-bootstrap-prompt.md`

---

## 3. WBS — 무엇을 분해하는가

좋은 WBS의 조건:
- **명사형**으로 산출물을 표현 ("로그인 화면", "API 엔드포인트")
- 동사형 활동이 아님 ("로그인을 만든다" ✗)
- 3단계 깊이까지만 — 더 깊으면 가독성 악화
- 각 항목은 **1~3일** 단위로 추정 가능해야 함

---

## 4. 6주 일정 매핑 (권장 템플릿)

| 주 | 목표 | 산출물 | 검증 |
|---|---|---|---|
| 10주차 | 기획·일정 | `.planning/*` | 본인 리뷰 |
| 11주차 | 설계·환경 | `docs/architecture.md`, 빌드 가능 상태 | "Hello World" 실행 |
| 12주차 | 핵심 기능 1 + **중간발표** | 동작하는 프로토타입 | 데모 가능 |
| 13주차 | 핵심 기능 2 + 테스트 | 주요 기능 완성 | 테스트 통과 |
| 14주차 | 마감·배포·문서 | 배포 산출물, 문서 | 배포 링크 또는 빌드 |
| 15주차 | **최종 발표** | 발표 자료, 회고 | 평가 |

---

## 5. 위험 식별 (필수)

각 팀은 최소 5개의 위험을 식별하고 대응 방안을 작성하세요.

| 카테고리 | 예시 |
|---|---|
| 기술 | 처음 써보는 라이브러리 — 학습 시간 |
| 일정 | 시험·과제 폭주 주간 |
| 협업 (2인) | 의사결정 지연 |
| 외부 의존 | API 키, 무료 티어 한도 |
| AI 의존 | AI가 만든 코드를 본인이 이해 못함 |

---

## 6. AI Agent에게 시키는 5가지 메타 작업

이번 주 본인이 직접 다음을 시켜야 합니다.

1. 기획 문서 자동 생성
2. WBS / 일정 자동 생성
3. **회의록 / 결정 사항** 자동 정리 (매 동기화 후)
4. 일정 진행률 자동 보고서 (주 1회)
5. 본인의 모르는 영역을 **질문 목록**으로 자동 추출

---

## 7. 의사결정 로그 (ADR)

> AI Agent가 만들어준 선택지 중 **하나를 골랐다면**
> 그 결정의 이유를 ADR로 남기세요.

```
.planning/decisions/ADR-0001-mobile-framework.md
.planning/decisions/ADR-0002-state-management.md
.planning/decisions/ADR-0003-backend-choice.md
```

ADR 한 장에는: 배경 / 결정 / 대안 / 결과

→ Q&A에서 "왜 이 기술인가?" 질문에 즉답 가능

---

## 8. 본인이 "이해했다"의 정의

다음 모두에 대답할 수 있다면 OK.

- [ ] 우리 프로젝트의 한 줄 가치 제안은?
- [ ] 첫 사용자는 누구이고 어떤 시나리오로 쓰는가?
- [ ] Must 기능 5개를 외워서 말할 수 있는가?
- [ ] 가장 큰 위험 1개와 대응 방법은?
- [ ] 이번 주 끝날 때까지 무엇이 되어 있어야 하는가?

---

## 9. 다음 세션까지 해야 할 일

1. 본인 리포지토리에 `.planning/` 5개 문서 push
2. 첫 ADR 1개 작성
3. `BONUS.md` 초안 — 어떤 가산점을 노릴지 표시
4. (선택) `AUTHORING.{본인이름}.v0.1.0.md` 초안

---

## 함께 보는 자료

- `resources/01-planning-workflow.md` — 기획 워크플로우 상세
- `resources/02-wbs-template.md` — WBS 템플릿
- `resources/03-adr-template.md` — ADR 템플릿
- `resources/04-risk-checklist.md` — 위험 체크리스트
