# AUTHORING.2024136033.v1.0

> 이 파일 하나를 AI Agent에게 주면 수다 프로젝트 환경이 즉시 재현된다.
> 새 세션 시작 시 "이 파일을 읽고 프로젝트 컨텍스트를 파악해줘"라고 하면 된다.

---

## 1. 프로젝트 정체성

```
프로젝트명: 수다
목적: 청각장애인을 위한 한국어 수어(KSL) → 자연어 실시간 번역 플랫폼
스택: React(프론트) + FastAPI(백엔드) + Gemini API(AI)
기간: 6주 (앱프로그래밍 응용 수업 개인 프로젝트)
```

---

## 2. AI Agent 워크플로우 (6단계)

이 프로젝트에서 검증된 작업 순서:

```
1. /spec   — 기능 사양 정의 (무엇을, 왜)
2. /plan   — 구현 계획 (어떻게, 순서)
3. /impl   — 코드 구현 (한 번에 하나씩)
4. /test   — 테스트 작성 및 실행
5. /review — 코드 품질 검토
6. /docs   — 문서 업데이트
```

**규칙:** 각 단계 산출물을 파일로 저장한 후 다음 단계 진행.

---

## 3. 코딩 컨벤션

### 백엔드 (FastAPI)
- 라우터: `backend/app/routers/` — 기능별 파일 분리
- 서비스: `backend/app/services/` — 외부 API 연동 로직
- 환경변수: `backend/for_deaf.env` 로드 (`.env` 아님)
- 테스트: `backend/tests/test_api.py` — pytest

### 프론트엔드 (React)
- 페이지: `frontend/src/pages/`
- 컴포넌트: `frontend/src/components/`
- 전역 상태: `frontend/src/contexts/AuthContext.jsx` (useState + Context API)
- API 통신: `frontend/src/services/api.js` — 모든 fetch 여기서 관리

### 문서
- 의사결정: `.planning/decisions/ADR-NNNN-*.md` (ADR 형식)
- 기술 문서: `docs/` (setup, deploy, testing, architecture)
- AI 활용 기록: `AGENTS.md`

---

## 4. 자주 쓰는 프롬프트 패턴

### 기능 추가 시
```
[기능명] 기능을 추가해줘.
- 백엔드: [엔드포인트]
- 프론트: [페이지/컴포넌트]
- 기존 코드 구조 유지할 것
```

### 버그 수정 시
```
[증상]이 발생해.
재현 방법: [단계]
에러 메시지: [메시지]
가설 3개와 각각의 검증 방법을 제시해줘.
```

### 문서 생성 시
```
실제 코드 기준으로 [문서명]을 작성해줘.
docs1/ 폴더의 템플릿 형식을 참고할 것.
뜬금없는 내용 넣지 말 것.
```

---

## 5. 이 프로젝트에서 배운 것 (시행착오)

| 문제 | 원인 | 해결 |
|------|------|------|
| `passlib` bcrypt 500 에러 | passlib↔bcrypt 4.x 버전 호환 문제 | `passlib` 제거, `bcrypt` 직접 사용 |
| Gemini API 429 | 무료 할당량 초과 | 다중 키 순환 로직 구현 |
| uvicorn 포트 좀비 | 프로세스 종료 미확인 | PowerShell로 PID 확인 후 강제 종료 |
| `genai.Client` httpx closed | 매 호출마다 새 클라이언트 생성 | 모듈 로드 시 클라이언트 미리 생성 |

---

## 6. 이 파일을 받은 AI Agent가 해야 할 것

1. 위 컨벤션을 따라 코드 작성
2. 새 기능은 반드시 `/spec → /impl → /test` 순서로
3. 결정 사항은 ADR로 기록
4. 기존 파일 구조 변경 전 반드시 확인
5. 테스트 없이 "완료"라고 하지 말 것

---

*AUTHORING.2024136033.v1.0 | 2026-06-18*
