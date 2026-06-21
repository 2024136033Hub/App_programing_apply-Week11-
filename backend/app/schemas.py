from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    password: str

class UserRegister(BaseModel):
    username: str
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    username: str


class HistoryCreate(BaseModel):
    translation_type: str
    input_words: str   # JSON array string  e.g. '["사과","병원"]'
    result: str


class HistoryItem(BaseModel):
    id: int
    translation_type: str
    input_words: str
    result: str
    created_at: datetime

    model_config = {"from_attributes": True}
