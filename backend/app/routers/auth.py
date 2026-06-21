import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app import auth as auth_utils

_EMAIL_RE = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.Token)
def register(data: schemas.UserRegister, db: Session = Depends(get_db)):
    if len(data.username.strip()) < 3 or len(data.username.strip()) > 20:
        raise HTTPException(status_code=400, detail="아이디는 3~20자여야 합니다.")
    if not _EMAIL_RE.match(data.email.strip()):
        raise HTTPException(status_code=400, detail="올바른 이메일 형식을 입력해주세요.")
    if len(data.password) < 6:
        raise HTTPException(status_code=400, detail="비밀번호는 6자 이상이어야 합니다.")
    if db.query(models.User).filter(models.User.username == data.username).first():
        raise HTTPException(status_code=400, detail="이미 사용 중인 아이디입니다.")
    if db.query(models.User).filter(models.User.email == data.email).first():
        raise HTTPException(status_code=400, detail="이미 사용 중인 이메일입니다.")
    user = models.User(
        username=data.username,
        email=data.email,
        hashed_password=auth_utils.hash_password(data.password),
    )
    db.add(user)
    db.commit()
    token = auth_utils.create_token(data.username)
    return {"access_token": token, "token_type": "bearer", "username": data.username}


@router.post("/login", response_model=schemas.Token)
def login(data: schemas.UserCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()
    if not user or not auth_utils.verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="아이디 또는 비밀번호가 틀렸습니다.")
    token = auth_utils.create_token(data.username)
    return {"access_token": token, "token_type": "bearer", "username": data.username}
