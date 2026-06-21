import httpx

WIKI_SUMMARY_API = "https://ko.wikipedia.org/api/rest_v1/page/summary"
WIKI_OPENSEARCH  = "https://ko.wikipedia.org/w/api.php"
HEADERS = {"User-Agent": "SudaApp/1.0 (https://github.com/2024136033Hub; cs026_c@ainuri.kr)"}

async def get_noun_image(word: str) -> str | None:
    async with httpx.AsyncClient() as client:
        # 1) OpenSearch로 가장 관련성 높은 실제 페이지 제목 찾기
        #    (동음이의어·disambiguation 페이지 우회)
        search_r = await client.get(
            WIKI_OPENSEARCH,
            params={"action": "opensearch", "search": word, "limit": 3, "format": "json"},
            headers=HEADERS,
            timeout=10,
        )
        if search_r.status_code != 200:
            return None
        search_data = search_r.json()
        titles = search_data[1] if len(search_data) > 1 else []
        if not titles:
            return None

        # 2) 검색된 제목 중 thumbnail이 있는 첫 번째 페이지 반환
        for title in titles:
            summary_r = await client.get(
                f"{WIKI_SUMMARY_API}/{title}",
                headers=HEADERS,
                timeout=10,
            )
            if summary_r.status_code != 200:
                continue
            thumbnail = summary_r.json().get("thumbnail", {}).get("source")
            if thumbnail:
                return thumbnail

        return None
