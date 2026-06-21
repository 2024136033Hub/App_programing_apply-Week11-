---
marp: true
theme: default
paginate: true
size: 16:9
header: "Vibe Coding Project — Session 5 / Build 2 + Testing"
footer: "© 2026 Project Kickoff"
---

# 세션 5 — 구현 2 + 테스트

> 중간 발표에서 받은 피드백을 반영하고
> **테스트**를 본격적으로 작성합니다.

---

## 오늘의 목표

1. Must 기능 100% + Should 기능 50%
2. 테스트 코드 작성 시작 (단위 / 위젯 / 통합)
3. 디버깅 방법론 정착
4. AI Agent의 워크플로우/스킬 적극 활용

---

## 1. 왜 테스트인가 — 평가 관점

> **"테스트는 어떻게 작성·실행하나요?"**
> 이 질문이 안 나올 확률 0%.

- 개발자 기본 소양 25점 중 **테스트 5점**
- "테스트가 없습니다"는 답이 안 됨
- 단 한 줄이라도 테스트 + 명령어로 실행 가능해야

---

## 2. 테스트의 3계층

| 계층 | 무엇을 검증 | 비용 | 권장 비율 |
|---|---|---|---|
| 단위 (Unit) | 함수/클래스 단위 | 낮음 | 70% |
| 위젯/컴포넌트 | UI 한 조각 | 중간 | 20% |
| 통합 (Integration / E2E) | 시나리오 전체 | 높음 | 10% |

> 본 프로젝트(7주)는 단위 + 핵심 시나리오 1~2개의 통합 정도면 충분.

---

## 3. 플랫폼별 테스트 도구

| 플랫폼 | 단위 | 위젯/UI | 통합/E2E |
|---|---|---|---|
| Flutter | `test` | `flutter_test` | `integration_test` |
| React Native | Jest | `@testing-library/react-native` | Detox / Maestro |
| Android | JUnit + Mockito | Compose Testing | Espresso / Maestro |
| iOS | XCTest | XCTest UI | XCUITest / Maestro |

---

## 4. 좋은 테스트의 조건

- **빠르다** (단위는 1초 미만)
- **결정적** (실행할 때마다 같은 결과)
- **외부 의존 없음** (네트워크 X, DB는 인메모리)
- **이름이 의도를 설명**: `should_return_empty_when_no_data`

---

## 5. AI Agent로 테스트 만들기

```
이 함수의 단위 테스트를 작성해줘.

조건:
- happy path 1개
- edge case 3개 (빈 입력, null, 경계값)
- 외부 의존은 mock
- 이름은 should_~_when_~ 형식
```

> 그 후 **본인이 읽고**, 빠진 케이스가 없는지 보강

---

## 6. 디버깅 방법론

| 단계 | 행동 |
|---|---|
| 1 | **재현 시나리오** 적기 (steps + 기대/실제) |
| 2 | 가장 가까운 로그/에러 캡처 |
| 3 | AI Agent에 컨텍스트와 함께 질문 |
| 4 | 가설 1개 → 최소 변경으로 검증 |
| 5 | 고친 후 회귀 테스트 추가 |

> AI에게 **"고쳐줘"** 보다 **"가설을 세워줘"** 가 더 나은 디버깅.

---

## 7. AI Agent 워크플로우 — 가산점 어필

이번 주에 본인 워크플로우를 정착시키세요.

| 슬래시 명령 예시 | 서브에이전트 예시 |
|---|---|
| `/spec`, `/plan`, `/implement`, `/test`, `/review`, `/retro` | `@code-reviewer`, `@test-writer`, `@bug-investigator` |

→ `.github/prompts/`, `.github/agents/` 에 저장 + 발표 시 시연

---

## 8. 본인만의 기법 가산점 (+5)

> 가장 점수 높은 가산 항목. 이번 주가 정착시킬 마지막 기회.

예:
- `AUTHORING.{본인이름}.md` 단일 파일로 모든 부트스트랩
- 본인만의 6단계 워크플로우 + 슬래시 명령 세트
- 본인 도메인 특화 서브에이전트 카탈로그

→ 발표 시 **2~3분 안에 설명**할 수 있도록 미리 정리

---

## 9. 이번 주 체크리스트

| 항목 | 완료 |
|---|---|
| Must 기능 100% |  |
| Should 기능 50% |  |
| 단위 테스트 최소 5개 |  |
| 통합/시나리오 테스트 1개 |  |
| `docs/testing.md` 작성 |  |
| AI Agent 슬래시 명령 3개 이상 정의 |  |
| 디버깅 사례 1개 `lessons/` 에 정리 |  |

---

## 10. 다음 세션까지

1. Should 기능 마무리
2. 배포 환경 준비 시작
3. `docs/deploy.md` 초안
4. 최종 발표 슬라이드 초안

---

## 함께 보는 자료

- `resources/01-test-strategy.md` — 테스트 전략 상세
- `resources/02-debugging-playbook.md` — 디버깅 플레이북
- `resources/03-ai-workflow-patterns.md` — AI Agent 워크플로우 패턴
