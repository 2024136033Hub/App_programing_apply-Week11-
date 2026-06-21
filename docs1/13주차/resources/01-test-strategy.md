# 테스트 전략 상세

## 1. 무엇을 테스트하는가

**테스트해야 할 것**:
- 비즈니스 로직 (계산, 변환, 결정)
- 경계값, 예외 케이스
- 외부 입력 검증

**테스트하지 않아도 되는 것**:
- 단순한 getter/setter
- 외부 라이브러리 자체 동작
- 로깅 출력 자체

## 2. 테스트 피라미드

```
        ┌───────┐
        │  E2E  │   10%  (시나리오 1~2개)
        ├───────┤
        │ 위젯  │   20%  (핵심 화면)
        ├───────┤
        │ 단위  │   70%  (로직 함수)
        └───────┘
```

## 3. 좋은 테스트 이름

`should_[기대결과]_when_[조건]`

예:
- `should_return_empty_list_when_query_is_empty`
- `should_throw_invalid_input_when_email_format_wrong`
- `should_navigate_to_home_when_login_succeeds`

## 4. AAA 패턴

```
// Arrange — 준비
val input = ...
val service = TestService(...)

// Act — 실행
val result = service.execute(input)

// Assert — 검증
expect(result).toEqual(...)
```

## 5. Mock / Fake / Stub

| 종류 | 용도 |
|---|---|
| Stub | 정해진 값을 반환하는 더미 |
| Mock | 호출 여부/인자 검증 |
| Fake | 가짜이지만 실제 비슷하게 동작 (예: in-memory DB) |

## 6. 테스트 실행 명령 (반드시 `docs/testing.md` 에)

```bash
# 단위 테스트 전체
[명령]

# 특정 파일만
[명령] [파일]

# 커버리지
[명령]
```

## 7. CI에 연결 (선택)

GitHub Actions 예 — `.github/workflows/test.yml`

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: [의존성 설치]
      - run: [테스트 명령]
```

→ CI 배지를 README에 붙이면 인상적
