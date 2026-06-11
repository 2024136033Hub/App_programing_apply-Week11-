import os
import httpx
from dotenv import load_dotenv

load_dotenv()

SIGN_TOTAL_KEY = os.getenv("SIGN_TOTAL_KEY")
UNIFIED_URL    = "https://api.kcisa.kr/API_CNV_054/request"


async def search_sign_word(word: str) -> list[dict]:
    """통합수어정보 API — keyword 실시간 검색."""
    async with httpx.AsyncClient() as client:
        r = await client.get(
            UNIFIED_URL,
            params={
                "serviceKey": SIGN_TOTAL_KEY,
                "numOfRows":  10,
                "pageNo":     1,
                "keyword":    word,
            },
            headers={"Accept": "application/json"},
            timeout=15,
        )
        r.raise_for_status()
        body        = r.json()["response"]["body"]
        items_block = body.get("items")
        if not items_block:
            return []
        raw = items_block["item"]
        if isinstance(raw, dict):
            raw = [raw]

        seen: set[str] = set()
        results = []
        for item in raw:
            full_title = item.get("title", "")
            if not full_title:
                continue
            parts     = [p.strip() for p in full_title.split(",") if p.strip()]
            primary   = parts[0]
            synonyms  = parts[1:]
            video_url = item.get("subDescription", "") or ""
            category  = item.get("categoryType", "") or ""

            # 같은 영상 = 완전히 같은 수어 → 중복 제거
            dedup_key = video_url if video_url else f"{primary}__{category}"
            if dedup_key in seen:
                continue
            seen.add(dedup_key)

            raw_imgs = item.get("signImages", "") or ""
            first_sign_img = raw_imgs.split(",")[0].strip() if raw_imgs else ""
            results.append({
                "word":        primary,
                "synonyms":    synonyms,
                "video_url":   video_url,
                "image_url":   item.get("imageObject", "") or "",
                "sign_image":  first_sign_img,
                "category":    category,
                "description": item.get("signDescription", "") or "",
            })
        return results
