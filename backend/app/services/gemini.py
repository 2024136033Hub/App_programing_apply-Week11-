import os
import base64
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def recognize_sign_from_frame(image_base64: str) -> str:
    image_bytes = base64.b64decode(image_base64)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[
            types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
            (
                "이 이미지에서 사람이 손으로 표현하고 있는 한국 수어(KSL) 단어가 무엇인지 "
                "한 단어로만 답하세요. "
                "손동작이 명확히 보이지 않거나 수어 동작이 없으면 반드시 '없음'이라고만 답하세요. "
                "설명, 이유, 부연 없이 단어만 출력하세요."
            ),
        ],
    )
    result = response.text.strip()
    return "" if result == "없음" else result

async def translate_words_to_sentence(words: list[str]) -> str:
    word_sequence = ", ".join(words)
    prompt = (
        "당신은 한국 수어(KSL) 번역 전문가입니다.\n"
        "아래 수어 단어 시퀀스를 자연스러운 한국어 문장으로 변환하세요.\n"
        "단어 나열이 아닌 실제 대화에서 쓰이는 자연스러운 문장으로 만들어주세요.\n\n"
        f"수어 단어 시퀀스: [{word_sequence}]\n"
        "자연스러운 한국어 문장:"
    )
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )
    return response.text.strip()
