# AI Agent 워크플로우 패턴

가산점 A/B를 노린다면 이 문서를 본인 프로젝트에 맞게 커스터마이즈하세요.

## 1. 6단계 표준 워크플로우

```
   /spec  →  /plan  →  /implement  →  /test  →  /review  →  /retro
   사양      계획      구현           테스트   리뷰        회고
```

각 단계의 산출물을 `.planning/` 또는 `docs/` 에 자동 저장.

## 2. 슬래시 명령 정의 (`.github/prompts/`)

### `spec.prompt.md`
```markdown
---
description: 새 기능의 사양서 작성
---
다음 기능의 사양서를 작성해줘.

기능: $ARG

산출물:
- `docs/specs/[kebab-name].md`
  - 동기 / 사용자 가치
  - 사용자 시나리오 2~3개
  - 입력/출력 / 화면 흐름
  - 데이터 모델
  - 예외 케이스
  - 수용 조건 (Acceptance Criteria)
```

### `plan.prompt.md`
```markdown
---
description: 사양서를 구현 가능한 작업으로 분해
---
다음 사양서를 읽고 구현 계획을 세워줘.

사양: $ARG

산출물:
- 작업 목록 (각 1~3시간 단위)
- 의존 관계
- 리스크 및 대안
- 우선순위
```

### `implement.prompt.md`
```markdown
---
description: 단일 작업을 구현
---
계획의 다음 작업 1개만 구현해줘.
- 한 번에 한 작업만
- 변경 파일을 명시
- 테스트도 함께 작성
```

### `test.prompt.md`
```markdown
---
description: 테스트 작성/보강
---
대상 함수/컴포넌트의 테스트를 작성·보강해줘.
- happy + edge 최소 3개
- mock 필요 시 명시
- AAA 패턴
```

### `review.prompt.md`
```markdown
---
description: 자체 코드 리뷰
---
방금 변경된 코드를 다음 관점으로 리뷰해줘:
- 가독성 / 명명
- 책임 분리 (SRP)
- 에러 처리
- 테스트 누락
- 보안 (입력 검증, 비밀 노출)
```

### `retro.prompt.md`
```markdown
---
description: 주간 회고
---
이번 주 git log와 .planning/ 변경을 기반으로
회고를 작성해줘.

- 잘된 것
- 막힌 것
- 다음 주 우선순위
```

## 3. 서브에이전트 (`.github/agents/`)

### `code-reviewer.agent.md`
```markdown
---
description: 코드 리뷰 전문 서브에이전트
tools: [read_file, grep_search, get_errors]
forbiddenTools: [replace_string_in_file, run_in_terminal]
---
역할: 변경된 코드만 보고 리뷰. 직접 수정하지 않음.
출력: 코멘트 목록 (라인 번호, 카테고리, 제안).
```

### `test-writer.agent.md`
```markdown
---
description: 테스트 작성 전문
tools: [read_file, replace_string_in_file, run_in_terminal]
---
역할: 함수/모듈 단위 테스트 작성.
규칙:
- AAA 패턴
- happy + edge 최소 3개
- 외부 의존 mock
```

### `bug-investigator.agent.md`
```markdown
---
description: 버그 원인 조사
tools: [read_file, grep_search, run_in_terminal]
forbiddenTools: [replace_string_in_file]
---
역할: 가설 3개와 검증 방법 제안. 직접 수정 금지.
```

## 4. 본인만의 통합 (가산점 +5)

권장 패턴 — 단일 md 부트스트랩:

```
AUTHORING.{본인이름}.v{버전}.md
   ↓ (이 한 파일만 있으면)
   → AGENTS.md 자동 생성
   → SPECS.md 자동 생성
   → .github/agents/*.agent.md 자동 설치
   → .github/prompts/*.prompt.md 자동 설치
   → .github/skills/*/SKILL.md 자동 설치
   → .github/instructions/*.instructions.md 자동 설치
```

참고 사례: `9주차/AUTHORING.DIMOHY.v1.5.3.md`

## 5. 발표 시 어필 방법

> "저희 워크플로우는 6단계 슬래시 명령으로 자동화되어 있습니다.
>  이 한 파일(`AUTHORING.본인.md`)만 있으면 새 프로젝트에서도
>  동일한 환경이 5분 안에 구축됩니다.
>  
>  실제 시연드리면..." (라이브 데모 30초)

→ 가산점 +5 확실
