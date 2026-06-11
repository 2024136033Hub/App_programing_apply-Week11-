from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import httpx
from app.services.sign_dictionary import search_sign_word
from app.services.wikipedia import get_noun_image

router = APIRouter(prefix="/dictionary", tags=["dictionary"])

ALLOWED_PROXY_DOMAINS = ["sldict.korean.go.kr"]

@router.get("/search")
async def search_sign(word: str):
    try:
        sign_results = await search_sign_word(word)
    except Exception:
        sign_results = []
    return {"results": sign_results}

@router.get("/image")
async def get_image(word: str):
    image_url = await get_noun_image(word)
    return {"image_url": image_url}

@router.get("/debug")
async def debug_raw(word: str):
    """캐시에서 해당 단어의 원본 데이터 확인용 (개발 전용)."""
    from app.services.sign_dictionary import _cache
    results = [item for item in _cache if word in item["word"]][:5]
    return {"count": len(results), "samples": results}

@router.get("/debug-unified")
async def debug_unified(word: str = "사과"):
    """통합수어정보 API 응답 구조 확인용 (개발 전용)."""
    import os
    from dotenv import load_dotenv
    load_dotenv()
    key = os.getenv("SIGN_TOTAL_KEY")
    async with httpx.AsyncClient() as client:
        r = await client.get(
            "https://api.kcisa.kr/API_CNV_054/request",
            params={"serviceKey": key, "numOfRows": 3, "pageNo": 1, "keyword": word},
            headers={"Accept": "application/json"},
            timeout=15,
        )
        return {"status": r.status_code, "raw": r.json() if r.status_code == 200 else r.text}

@router.get("/media-proxy")
async def media_proxy(url: str):
    """sldict.korean.go.kr의 수어 영상·이미지를 서버 측에서 중계."""
    if not any(domain in url for domain in ALLOWED_PROXY_DOMAINS):
        raise HTTPException(status_code=403, detail="허용되지 않는 도메인입니다.")

    content_type = "video/mp4" if url.lower().endswith(".mp4") else "image/jpeg"

    async def stream():
        async with httpx.AsyncClient() as client:
            async with client.stream(
                "GET", url, timeout=30, follow_redirects=True,
                headers={"Referer": "https://sldict.korean.go.kr/"}
            ) as r:
                async for chunk in r.aiter_bytes(chunk_size=8192):
                    yield chunk

    return StreamingResponse(
        stream(),
        media_type=content_type,
        headers={"Cache-Control": "public, max-age=86400"},
    )
