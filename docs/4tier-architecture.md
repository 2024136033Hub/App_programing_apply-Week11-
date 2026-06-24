# 4계층 아키텍처 (4-Tier Architecture)

## 개요

수다(Suda) 앱은 프레젠테이션 · 애플리케이션 · 비즈니스 로직 · 데이터 4계층으로 구성됩니다.

---

## 계층 구조

```
┌─────────────────────────────────────────────┐
│  1계층  프레젠테이션 계층 (Presentation Layer) │
│         React 19 + Tailwind CSS (Vite)       │
└────────────────────┬────────────────────────┘
                     │ HTTP (fetch / axios)
┌────────────────────▼────────────────────────┐
│  2계층  애플리케이션 계층 (Application Layer) │
│         FastAPI Routers                      │
│         /auth  /translate  /dictionary       │
│         /history  /media-proxy               │
└────────────────────┬────────────────────────┘
                     │ 함수 호출
┌────────────────────▼────────────────────────┐
│  3계층  비즈니스 로직 계층 (Business Layer)   │
│         services/                            │
│         gemini.py · sign_dictionary.py       │
│         wikipedia.py                         │
│         + 외부 API 연동                       │
│           Gemini · Groq · 통합수어정보 · Wikipedia │
└────────────────────┬────────────────────────┘
                     │ SQLAlchemy ORM
┌────────────────────▼────────────────────────┐
│  4계층  데이터 계층 (Data Layer)              │
│         SQLite (accessai.db)                 │
│         models.py — User, History 테이블     │
│         database.py — 세션 관리               │
└─────────────────────────────────────────────┘
```

---

## 계층별 상세

### 1계층 — 프레젠테이션 계층

| 항목 | 내용 |
|------|------|
| 기술 | React 19, Tailwind CSS, Vite |
| 역할 | 사용자 UI 렌더링, 웹캠 접근, 사용자 입력 처리 |
| 주요 파일 | `frontend/src/pages/`, `frontend/src/components/` |
| 상태 관리 | useState + Context API (AuthContext) |

### 2계층 — 애플리케이션 계층

| 항목 | 내용 |
|------|------|
| 기술 | Python FastAPI |
| 역할 | HTTP 요청 수신, 라우팅, 입력 유효성 검사, 인증(JWT) |
| 주요 파일 | `backend/app/routers/` (translate, dictionary, auth, history) |
| 특징 | Pydantic 스키마로 요청/응답 타입 보장 |

### 3계층 — 비즈니스 로직 계층

| 항목 | 내용 |
|------|------|
| 기술 | Python (서비스 모듈) |
| 역할 | 핵심 비즈니스 규칙 처리, 외부 AI·사전 API 연동 |
| 주요 파일 | `backend/app/services/gemini.py`, `sign_dictionary.py`, `wikipedia.py` |
| 외부 API | Gemini 2.0 Flash (Vision + 자연어), Groq llama-3.3-70b (폴백), 통합수어정보 API, Wikipedia API |

### 4계층 — 데이터 계층

| 항목 | 내용 |
|------|------|
| 기술 | SQLite + SQLAlchemy ORM |
| 역할 | 회원 정보 저장, 번역 기록 영속성 관리 |
| 주요 파일 | `backend/app/models.py`, `backend/app/database.py` |
| 테이블 | `users` (id, username, hashed_password), `history` (id, user_id, words, result, created_at) |

---

## 계층 간 의존성 규칙

- 상위 계층은 바로 아래 계층만 호출합니다 (1→2→3→4 단방향).
- 하위 계층은 상위 계층을 알지 못합니다 (역방향 의존성 없음).
- 외부 API는 3계층(비즈니스 로직)에서만 호출합니다.

---

## 요청 흐름 예시 — 텍스트 번역

```
사용자 입력 (1계층, React)
  → POST /translate/text (2계층, FastAPI Router)
    → gemini.py 호출 (3계층, Service)
      → Gemini API / Groq API (외부)
    → history 저장 (3→4계층, SQLAlchemy)
  → 번역 결과 반환 (2→1계층)
→ 화면 출력 (1계층, React)
```
