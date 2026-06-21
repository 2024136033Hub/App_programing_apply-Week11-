# Setup — 개발 환경 설정

새로운 환경에서 처음부터 실행하는 방법입니다.

---

## 사전 요구사항

| 도구 | 버전 | 확인 명령 |
|------|------|-----------|
| Python | 3.10+ | `python --version` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| Git | 2.40+ | `git --version` |

---

## 1. 클론

```bash
git clone https://github.com/2024136033Hub/App_programing_apply-Week11-
cd App_programing_apply-Week11-/project_3-1-2
```

---

## 2. 백엔드 설정

```bash
cd backend
pip install -r requirements.txt
```

### 환경 변수 설정

`backend/for_deaf.env` 파일 생성:

```env
GEMINI_API_KEY=여기에_발급받은_키_입력
SIGN_TOTAL_KEY=여기에_발급받은_키_입력
```

- **GEMINI_API_KEY**: [Google AI Studio](https://aistudio.google.com) 에서 발급
- **SIGN_TOTAL_KEY**: [공공데이터포털](https://www.data.go.kr) → 국립국어원 통합수어정보 API 신청

### 백엔드 실행

```bash
uvicorn app.main:app --reload --port 8000
```

성공 시: `http://localhost:8000` 에서 `{"message": "수다 백엔드 서버 정상 동작 중"}` 응답

---

## 3. 프론트엔드 설정

```bash
cd frontend
npm install
npm run dev
```

성공 시: `http://localhost:5173` 에서 수다 메인 화면 확인

---

## 4. 자주 묻는 문제

### Q. `pip install` 중 bcrypt 오류
→ `pip install bcrypt --upgrade` 후 재시도

### Q. `uvicorn: command not found`
→ `pip install uvicorn[standard]`

### Q. 프론트에서 백엔드 연결 안 됨
→ 백엔드가 8000번 포트에서 실행 중인지 확인. `frontend/.env` 파일에 `VITE_API_URL=http://localhost:8000` 추가

### Q. 번역이 안 됨 (500 에러)
→ `backend/for_deaf.env` 의 `GEMINI_API_KEY` 확인. 할당량 초과 시 Google AI Studio에서 새 키 발급

### Q. 수어 사전 결과가 없음
→ `SIGN_TOTAL_KEY` 확인. 공공데이터포털에서 API 신청 승인 여부 확인
