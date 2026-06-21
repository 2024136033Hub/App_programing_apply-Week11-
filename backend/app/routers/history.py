from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.auth import get_current_user

router = APIRouter(prefix="/history", tags=["history"])


@router.get("/", response_model=List[schemas.HistoryItem])
def get_history(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
    return (
        db.query(models.History)
        .filter(models.History.user_id == current_user.id)
        .order_by(models.History.created_at.desc())
        .all()
    )


@router.post("/", response_model=schemas.HistoryItem)
def add_history(
    data: schemas.HistoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
    item = models.History(
        user_id=current_user.id,
        translation_type=data.translation_type,
        input_words=data.input_words,
        result=data.result,
    )
    db.add(item)
    db.commit()
    db.refresh(item)

    # 최근 10개만 유지 — 초과분 삭제
    all_items = (
        db.query(models.History)
        .filter(models.History.user_id == current_user.id)
        .order_by(models.History.created_at.desc())
        .all()
    )
    if len(all_items) > 20:
        for old in all_items[10:]:
            db.delete(old)
        db.commit()

    return item


@router.delete("/all")
def delete_all_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
    db.query(models.History).filter(models.History.user_id == current_user.id).delete()
    db.commit()
    return {"ok": True}


@router.delete("/{item_id}")
def delete_history(
    item_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=401, detail="로그인이 필요합니다.")
    item = (
        db.query(models.History)
        .filter(models.History.id == item_id, models.History.user_id == current_user.id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=404, detail="항목을 찾을 수 없습니다.")
    db.delete(item)
    db.commit()
    return {"ok": True}
