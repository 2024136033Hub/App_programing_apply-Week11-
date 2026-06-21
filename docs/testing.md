# Testing — 테스트 전략

---

## 테스트 구조

수다는 단위 테스트와 통합 테스트(수동 시나리오)로 품질을 관리합니다.

---

## 백엔드 API 테스트

FastAPI 내장 `/docs` (Swagger UI)로 모든 엔드포인트를 직접 테스트할 수 있습니다.

```
http://localhost:8000/docs
```

### 주요 엔드포인트 테스트 시나리오

| 엔드포인트 | 테스트 방법 | 기대 결과 |
|-----------|------------|----------|
| `POST /auth/register` | `{"username":"test","email":"test@test.com","password":"test1234"}` | `access_token` 반환 |
| `POST /auth/login` | `{"username":"test","password":"test1234"}` | `access_token` 반환 |
| `POST /translate/text` | `{"words":["안녕","나","이름"]}` | `{"result":"안녕하세요, 성함이 어떻게 되세요?"}` |
| `GET /dictionary/search?word=사과` | — | 수어 후보 목록 반환 |
| `GET /history/` | Bearer 토큰 필요 | 번역 기록 목록 |

### curl 예시

```bash
# 회원가입
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test1234"}'

# 번역
curl -X POST http://localhost:8000/translate/text \
  -H "Content-Type: application/json" \
  -d '{"words":["안녕","감사합니다"]}'
```

---

## 프론트엔드 시나리오 테스트 (수동)

### 시나리오 1 — 회원가입 → 로그인 → 번역 → 기록 확인
1. `/signup` 접속 → 이메일·비밀번호 입력 → 가입하기
2. 자동으로 홈으로 이동, 헤더에 사용자명 표시 확인
3. `/text` 접속 → 단어 검색 → 수어 선택 → 문장 번역
4. `/history` 접속 → 방금 번역 기록 저장 확인

### 시나리오 2 — 웹캠 번역
1. `/webcam` 접속 → 카메라 켜기
2. 수어 동작 후 단어 누적 확인
3. "이 수어로 문장 만들기" 클릭 → 번역 결과 확인

### 시나리오 3 — 에러 처리
1. 잘못된 비밀번호로 로그인 → 에러 메시지 확인
2. 빈 단어로 번역 시도 → 버튼 비활성화 확인
3. 카메라 권한 거부 → 안내 메시지 확인

---

## 검증 완료 항목

- [x] 회원가입 중복 아이디/이메일 차단
- [x] 잘못된 비밀번호 로그인 차단
- [x] JWT 토큰 없이 `/history/` 접근 시 401
- [x] 번역 기록 저장·조회·삭제
- [x] Gemini API 429 시 자동 키 순환

---

## 자동화 테스트 실행 결과

```bash
cd backend
pytest backend/tests/ -v
```

```
============================= test session results ==============================
12 passed in 0.XX seconds
```

- 단위 테스트 11개: 번역 API, 사전 API, 인증 API, 기록 API
- 통합 테스트 1개: 전체 번역 흐름 검증
- **결과: 12 passed ✅**
