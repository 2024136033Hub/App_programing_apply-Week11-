import os
import base64
import httpx
from pathlib import Path
from google import genai
from google.genai import types
from google.genai.errors import ClientError
from dotenv import load_dotenv

load_dotenv(Path(__file__).parents[2] / 'for_deaf.env')

_GROQ_KEY = os.getenv("GROQ_API_KEY")

_KEYS = [
    k for k in [
        os.getenv("GEMINI_API_KEY"),
        os.getenv("GEMINI_API_KEY_2"),
        os.getenv("GEMINI_API_KEY_3"),
        os.getenv("GEMINI_API_KEY_4"),
    ] if k
]

_clients = [genai.Client(api_key=k) for k in _KEYS]
_key_index = 0


def _current_client() -> genai.Client:
    return _clients[_key_index]


def _next_key():
    global _key_index
    _key_index = (_key_index + 1) % len(_clients)


async def _groq_translate(words: list[str]) -> str:
    if not _GROQ_KEY:
        return " ".join(words) + "."
    system = "You are a Korean Sign Language translator. Always respond in Korean only. Never use any other language."
    prompt = (
        "한국 수어(KSL)는 주제-설명 구조로 조사와 어미가 생략됩니다.\n"
        f"수어 단어 순서: {' → '.join(words)}\n"
        "이 단어들의 의미를 살려 자연스러운 한국어 문장 1개만 출력하세요.\n"
        "반드시 한국어로만. 다른 언어 절대 금지. 문장만 출력."
    )
    async with httpx.AsyncClient(timeout=20) as client:
        r = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {_GROQ_KEY}", "Content-Type": "application/json"},
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt}
                ]
            },
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()


_PROMPT = (
    "이 이미지에서 사람이 손으로 표현하고 있는 한국 수어(KSL) 단어가 무엇인지 "
    "한 단어로만 답하세요. "
    "손동작이 명확히 보이지 않거나 수어 동작이 없으면 반드시 '없음'이라고만 답하세요. "
    "설명, 이유, 부연 없이 단어만 출력하세요."
)


async def recognize_sign_from_frame(image_base64: str) -> str:
    if not _clients:
        raise RuntimeError("Gemini API 키가 설정되지 않았습니다. for_deaf.env를 확인하세요.")

    image_bytes = base64.b64decode(image_base64)
    last_error = None

    for _ in range(len(_clients)):
        try:
            response = _current_client().models.generate_content(
                model="gemini-2.0-flash",
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
                    _PROMPT,
                ],
            )
            result = response.text.strip()
            return "" if result == "없음" else result
        except Exception as e:
            last_error = e
            _next_key()
            continue

    return ""


async def translate_words_to_sentence(words: list[str]) -> str:
    word_sequence = ", ".join(words)
    prompt = (
        "당신은 한국 수어(KSL) 번역 전문가입니다.\n"
        "아래 수어 단어 시퀀스를 자연스러운 한국어 문장으로 변환하세요.\n"
        "단어 나열이 아닌 실제 대화에서 쓰이는 자연스러운 문장으로 만들어주세요.\n\n"
        f"수어 단어 시퀀스: [{word_sequence}]\n"
        "자연스러운 한국어 문장:"
    )
    last_error = None

    for _ in range(len(_clients)):
        try:
            response = _current_client().models.generate_content(
                model="gemini-2.0-flash",
                contents=prompt,
            )
            return response.text.strip()
        except Exception as e:
            last_error = e
            _next_key()
            continue

    return await _groq_translate(words)
