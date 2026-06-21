from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.gemini import translate_words_to_sentence, recognize_sign_from_frame

router = APIRouter(prefix="/translate", tags=["translate"])

class TranslateRequest(BaseModel):
    words: list[str]

class FrameRequest(BaseModel):
    image: str  # base64 encoded JPEG

@router.post("/text")
async def translate_text(request: TranslateRequest):
    try:
        result = await translate_words_to_sentence(request.words)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webcam")
async def translate_webcam(request: TranslateRequest):
    try:
        result = await translate_words_to_sentence(request.words)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/webcam-frame")
async def recognize_webcam_frame(request: FrameRequest):
    try:
        word = await recognize_sign_from_frame(request.image)
        return {"word": word}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
