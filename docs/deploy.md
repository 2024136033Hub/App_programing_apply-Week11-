# Deploy — 배포 가이드

수다는 백엔드(Render) + 프론트엔드(Vercel) 조합으로 배포합니다.

---

## 백엔드 배포 (Render)

### 1. Render 가입 및 서비스 생성
1. [render.com](https://render.com) 접속 → New → **Web Service**
2. GitHub 리포지토리 연결
3. 설정:

| 항목 | 값 |
|------|-----|
| Root Directory | `project_3-1-2/backend` |
| Runtime | `Python 3` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### 2. 환경 변수 설정 (Render Dashboard → Environment)

```
GEMINI_API_KEY=발급받은_키
SIGN_TOTAL_KEY=발급받은_키
```

> ⚠️ `for_deaf.env` 파일은 git에 올리지 않으므로 반드시 Render에서 직접 입력

### 3. 배포 확인
배포 완료 후 `https://[서비스명].onrender.com/` 접속 → `{"message": "수다 백엔드 서버 정상 동작 중"}`

---

## 프론트엔드 배포 (Vercel)

### 1. Vercel 가입 및 프로젝트 연결
1. [vercel.com](https://vercel.com) 접속 → New Project
2. GitHub 리포지토리 연결
3. 설정:

| 항목 | 값 |
|------|-----|
| Root Directory | `project_3-1-2/frontend` |
| Framework Preset | `Vite` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

### 2. 환경 변수 설정 (Vercel Dashboard → Settings → Environment Variables)

```
VITE_API_URL=https://[Render에서받은URL].onrender.com
```

### 3. 배포 확인
배포 완료 후 Vercel URL 접속 → 수다 메인 화면 확인

---

## CORS 설정 업데이트

프로덕션 배포 시 `backend/app/main.py` 의 CORS 설정에 Vercel URL 추가:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://[프로젝트명].vercel.app",
    ],
    ...
)
```

---

## 버전 관리

- 태그 형식: `v1.0.0` (SemVer)
- 배포 전 `CHANGELOG` 또는 커밋 메시지에 변경 내용 기록
