# ADR (Architecture Decision Record) 템플릿

파일명: `.planning/decisions/ADR-NNNN-{kebab-title}.md`

```markdown
# ADR-0001: [짧은 결정 제목]

- 상태: Proposed | Accepted | Deprecated | Superseded by ADR-NNNN
- 날짜: YYYY-MM-DD
- 결정자: [본인 또는 팀]

## 배경

무엇을 결정해야 했는가. 왜 결정이 필요한가.

## 고려한 대안

### 대안 A: [이름]
- 장점:
- 단점:

### 대안 B: [이름]
- 장점:
- 단점:

### 대안 C: [이름]
- 장점:
- 단점:

## 결정

[대안 X]를 선택한다.

## 이유

- ...
- ...

## 결과 (예상되는 영향)

긍정:
- ...

부정 / 제약:
- ...

## 후속 작업

- [ ] ...
- [ ] ...
```

## 작성 시점

- 모바일 프레임워크 선택 → ADR-0001
- 상태 관리 라이브러리 선택 → ADR-0002
- 백엔드 (직접 / Firebase / Supabase 등) → ADR-0003
- 인증 방식 → ADR-0004
- 배포 채널 → ADR-0005

## Q&A 대비 효과

발표 중 "왜 [기술 X]를 선택하셨나요?"
→ ADR을 한 화면에 띄우고 답변

→ **AI가 만들었어도 본인이 검토·동의했음을 증명**
