# 수어 API 연동 메모 (Claude Code가 읽고 반영할 것)

두 수어 API는 data.go.kr에서 **"LINK" 타입**이라, 실제 호출은 `apis.data.go.kr`가 아니라
**문화데이터광장 / 한국문화정보원(KCISA)** 엔드포인트(`api.kcisa.kr`)로 한다.
키는 data.go.kr에서 받은 **UUID 형식 serviceKey를 그대로** 사용한다.
(기존 코드의 `apis.data.go.kr/B0...` 주소는 잘못된 것이므로 폐기)

## 공통 규칙 (KCISA 패턴)
- 방식: `GET`
- 응답 기본은 XML. JSON으로 받고 싶으면 헤더 `Accept: application/json` 추가.
- 공통 파라미터: `serviceKey`, `numOfRows`, `pageNo`, `keyword`(검색어=제목)
- ★★ 주의: `keyword`가 빈 값이어도 `&keyword=` 형태로 **반드시 포함**해서 호출
- 응답 골격: `resultCode`, `resultMsg`, 그리고 `item` 목록 (대개 `response > body > items > item`)

## 1) 일상생활 수어  ✅ 확인됨
- 엔드포인트: `https://api.kcisa.kr/openapi/service/rest/meta13/getCTE01701`
- 키 변수: `SIGN_DAILY_KEY`
- 응답 주요 필드:
  - `title`           : 표제어(명칭)
  - `signDescription` : 수형 설명 (2025.04.25 추가)
  - `signImages`      : 수형 이미지 경로, 여러 개면 `,`로 구분 → 첫 번째만 써도 됨
  - `분류항목`         : 개념 / 경제생활 / 교육 / … / 주생활 (2025.05.22 추가)

## 2) 통합 수어정보  ⚠️ 엔드포인트 경로만 확정 필요 (패턴은 동일)
- 찾는 법: `https://www.data.go.kr/data/15105243/openapi.do` → "바로가기"로
  culture.go.kr(KCISA) openapiView 페이지 이동 → 거기 **Java/JS 샘플 코드의 `url` 값**이 실제 엔드포인트.
  (형태 예시: `https://api.kcisa.kr/openapi/service/rest/metaXX/getXXXXXX`)
- 키 변수: `SIGN_UNIFIED_KEY`
- 제공: 한국어 설명 + 부가정보(수형 영상물/이미지 경로 URL, UCI 식별자 등)

## 최종 검증 (제일 확실한 방법)
- openapiView 페이지의 "미리보기"에 `keyword=사과` 넣고 한 번 호출 →
  나온 **실제 JSON/XML 응답을 보고 필드명(특히 이미지·영상 키)을 최종 확정**한다.
- 확정되면 `for_deaf.env`의 `USE_REAL_SIGN_API=true` 로 변경.
