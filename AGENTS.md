# AGENTS.md — AI Agent 운영 가이드

본 프로젝트는 **Claude Code (AI Agent)** 를 기획·설계·구현·문서화 전 과정에 적극 활용하였습니다.

---

## 활용한 AI Agent

| 도구 | 용도 |
|------|------|
| Claude Code (claude-sonnet-4-6) | 기획 문서 생성, 코드 구현, 디버깅, 문서화 |

---

## 워크플로우

```
1. /spec  — 기능 사양 정의 (비전, 요구사항, MoSCoW)
2. /plan  — WBS·일정·위험 식별
3. /impl  — 코드 구현 (백엔드 API, 프론트엔드 컴포넌트)
4. /test  — 테스트 시나리오 검증
5. /docs  — 문서 자동 생성 (ADR, setup, deploy, testing)
```

---

## 구체적 활용 사례

### 기획 단계
- `.planning/00-vision.md` — 비전·타겟·핵심 가치 AI 초안 → 본인 검토·수정
- `.planning/01-requirements.md` — 사용자 시나리오 3개 + MoSCoW 분류
- `.planning/02-wbs.md` — WBS 3단계 분해
- `.planning/04-schedule.md` — 6주 일정 + 위험 관리

### 설계·구현 단계
- `docs/architecture.md` — 시스템 아키텍처 + Mermaid 다이어그램
- `.planning/decisions/ADR-000*.md` — 기술 선택 의사결정 기록 3개
- 백엔드: FastAPI 라우터, SQLAlchemy 모델, JWT 인증, Gemini API 키 순환 로직
- 프론트엔드: React Context API 인증, 번역 기록 CRUD, 반응형 UI

### 디버깅 사례
- `passlib` ↔ `bcrypt` 버전 호환 문제 → `bcrypt` 직접 사용으로 전환
- Gemini API 429 할당량 초과 → 다중 키 순환 로직 구현
- `genai.Client` 재사용 문제 (`httpx` closed) → 모듈 로드 시 클라이언트 미리 생성

---

## 서브에이전트 활용

```
Claude Code 내장 스킬:
- /code-review  — 변경 코드 품질 검토
- /run          — 앱 실행 및 기능 검증
- /simplify     — 코드 단순화
```

---

## AI 생성물 검토 원칙

> AI가 작성한 모든 코드·문서는 **본인이 직접 읽고 이해한 후** 사용합니다.
> "AI가 만들었다"는 이유로 이해 없이 사용하지 않으며,
> Q&A에서 모든 내용을 본인의 언어로 설명할 수 있습니다.

---

## 본인만의 기법 — 단일 컨텍스트 부트스트랩

Claude Code의 **자동 메모리 시스템**(`~/.claude/projects/*/memory/`)을 활용하여
세션 간 프로젝트 컨텍스트를 유지했습니다.

- 프로젝트 상태, 완료된 작업, 다음 우선순위가 세션 시작 시 자동 로드
- 매 세션 "어디까지 했나요?" 없이 바로 이어서 작업 가능
- 배점 기준, ADR 현황, 남은 작업이 항상 동기화
