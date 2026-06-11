from fastapi import APIRouter
from pydantic import BaseModel
from app.services.gemini import translate_words_to_sentence, recognize_sign_from_frame

router = APIRouter(prefix="/translate", tags=["translate"])

class TranslateRequest(BaseModel):
    words: list[str]

class FrameRequest(BaseModel):
    image: str  # base64 encoded JPEG

@router.post("/text")
async def translate_text(request: TranslateRequest):
    result = await translate_words_to_sentence(request.words)
    return {"result": result}

@router.post("/webcam")
async def translate_webcam(request: TranslateRequest):
    result = await translate_words_to_sentence(request.words)
    return {"result": result}

@router.post("/webcam-frame")
async def recognize_webcam_frame(request: FrameRequest):
    word = await recognize_sign_from_frame(request.image)
    return {"word": word}
