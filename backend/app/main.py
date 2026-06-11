from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import translate, dictionary

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(title="AccessAI API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(translate.router)
app.include_router(dictionary.router)

@app.get("/")
def root():
    return {"message": "AccessAI 백엔드 서버 정상 동작 중"}
