# ADR-0003: 백엔드 프레임워크 선택

**상태:** 채택 (Accepted)
**작성일:** 2025-05-18
**작성자:** 수다 프로젝트
**관련 문서:** 00-vision.md, 01-requirements.md, ADR-0001-mobile-framework.md

---

## 1. 배경 (Context)

수다 백엔드는 다음 역할을 담당해야 한다.

- **AI API 호출** — Gemini Vision API (수어 프레임 인식) + Gemini API (자연어 문장 변환)
- **외부 API 프록시** — 국립국어원 통합수어정보 API, Wikipedia API
- **인증 처리** — 회원가입·로그인, JWT 토큰 발급·검증
- **데이터 저장** — 사용자 정보, 번역 기록 (SQLite)

AI 핵심 기능이 Python SDK(`google-genai`)를 통해 제공되므로 백엔드 언어는 **Python이 사실상 필수**다. Python 프레임워크 중 어떤 것을 선택하느냐가 개발 속도와 유지보수에 직접 영향을 미친다.

---

## 2. 결정 (Decision)

**Python FastAPI** 를 백엔드 프레임워크로 채택한다.

### 채택 이유
1. **`google-genai` Python SDK 완전 호환** — Gemini API를 가장 안정적으로 연동 가능
2. **`async/await` 기본 지원** — 외부 API (Gemini, 수어 사전, Wikipedia) 동시 호출 시 비동기 처리로 응답 속도 향상
3. **Pydantic 자동 타입 검증** — 요청/응답 데이터 검증 코드를 별도로 작성하지 않아도 됨
4. **자동 API 문서 생성** — `/docs` (Swagger UI)로 모든 엔드포인트 즉시 확인 가능, 발표 Q&A 시 유용
5. **빠른 개발 속도** — 최소한의 코드로 라우터·스키마·미들웨어 구성 가능, 6주 일정에 적합

---

## 3. 대안 (Alternatives Considered)

### 대안 A — Django (Python)

**장점**
- ORM, Admin 패널, 인증, 폼 처리 등 배터리 포함 (batteries included)
- 성숙한 생태계, 레퍼런스 풍부
- Django REST Framework(DRF)로 REST API 구축 가능

**단점**
- API 서버 단독 용도에 비해 구조가 무겁고 설정이 복잡
- 비동기 지원이 Django 4.x부터 일부 추가됐으나 완전하지 않음
- MVT 패턴 학습 필요, 6주 일정 내 학습 부담

**미채택 사유**
단순 AI API 서버 역할에 Django의 풀스택 기능은 과도하다. 비동기 처리가 핵심인 AI API 연동 구조에 적합하지 않다.

---

### 대안 B — Flask (Python)

**장점**
- 경량 마이크로 프레임워크, 빠른 시작
- 구조 제약이 없어 자유로운 설계 가능
- 학습 곡선이 낮음

**단점**
- 비동기(async/await) 미지원 (기본 WSGI 방식)
- 타입 힌팅, 자동 문서화 없음 — 별도 라이브러리(marshmallow 등) 필요
- 규모가 커질수록 일관성 없는 코드 구조 발생 가능

**미채택 사유**
비동기 지원이 없어 외부 API 다중 호출 성능이 떨어진다. FastAPI 대비 생산성 이점이 없다.

---

### 대안 C — Express.js (Node.js)

**장점**
- 프론트엔드(React)와 JavaScript 단일 언어 스택 구성 가능
- npm 생태계 활용 가능
- 비동기 처리(Promise, async/await) 지원

**단점**
- Python `google-genai` SDK 사용 불가 — Node.js용 Google AI SDK는 기능 및 안정성이 Python 대비 제한적
- AI/ML 라이브러리 생태계가 Python에 집중되어 있어 추후 확장 시 제약
- 백엔드만을 위해 Node.js 환경 별도 구성 필요

**미채택 사유**
Gemini SDK 최적 환경이 Python이므로 언어 통일의 이점보다 기능 제약의 손실이 훨씬 크다.

---

## 4. 결과 (Consequences)

### 긍정적 영향
- ✅ `google-genai` SDK를 통한 Gemini API 안정적 연동
- ✅ 외부 API 3개 (Gemini, 수어 사전, Wikipedia) 비동기 동시 호출로 응답 속도 향상
- ✅ `/docs` 자동 문서화로 엔드포인트 확인 및 발표 Q&A 대응 용이
- ✅ SQLAlchemy + SQLite 연동으로 별도 DB 서버 없이 번역 기록 저장 가능
- ✅ Pydantic 스키마로 요청/응답 타입 안정성 확보

### 부정적 영향
- ⚠️ 프론트엔드(JS)와 언어가 달라 풀스택 단일 언어 구성 불가
- ⚠️ 배포 시 Python 런타임 환경 별도 구성 필요

### 대응 방안
- 언어 불일치 문제는 API 인터페이스(JSON)로 명확히 분리하여 영향 최소화
- Python 환경 배포는 Render(PaaS)를 활용하여 환경 설정 자동화

---

## 5. 검토 일정 (Review)

- **1차 검토:** 2주차 종료 시점 (FastAPI 서버 기본 구조 완성 후)
- **재검토 기준:** 실시간 동시 접속 처리가 필요해질 경우 비동기 처리 구조 고도화 검토

---

*ADR-0003 | v1.0 | 2025-05-18*
