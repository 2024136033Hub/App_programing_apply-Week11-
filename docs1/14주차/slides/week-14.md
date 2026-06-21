---
marp: true
theme: default
paginate: true
size: 16:9
header: "Vibe Coding Project — Session 6 / Release & Deploy"
footer: "© 2026 Project Kickoff"
---

# 세션 6 — 마감 & 배포

> 이번 세션 종료 시 본인 프로젝트는
> **누군가에게 보여줄 수 있는 상태**여야 합니다.

---

## 오늘의 목표

1. 모든 Must + Should 기능 동작
2. 빌드 / 배포 파이프라인 정착
3. README + 4종 docs 완성
4. 최종 발표 슬라이드 거의 완성
5. 본인 데모 환경 백업

---

## 1. 모바일 앱 "배포"의 옵션

| 옵션 | 난이도 | 학습 효과 |
|---|---|---|
| 로컬 디바이스 빌드 (apk / ipa 사이드로드) | ★ | 중 |
| Firebase App Distribution / TestFlight | ★★ | 상 |
| Google Play Internal Testing | ★★★ | 상 |
| App Store TestFlight 외부 | ★★★ | 상 |
| Codemagic / EAS Build / GitHub Actions | ★★★ | 최상 |

> 본 프로젝트(7주)에서는 **최소 apk/ipa 산출 + 한 사람 이상이 설치해본 흔적**이면 통과.

---

## 2. `docs/deploy.md` 의 절대 조건

발표 Q&A에서 "배포는 어떻게 하나요?" 질문에 답할 자료.

포함 내용:
1. 빌드 종류 (debug / release / profile)
2. 서명 / 인증서 관리
3. 환경별 설정 (`.env.dev`, `.env.prod`)
4. 배포 채널 / 명령
5. 버전 관리 규칙 (SemVer)
6. 롤백 방법

---

## 3. 빌드 파이프라인 예 (Flutter)

```bash
# 디버그
flutter run --debug

# 릴리스 APK
flutter build apk --release --split-per-abi

# iOS 릴리스
flutter build ios --release
xcodebuild -workspace ios/Runner.xcworkspace ...
```

> 명령어를 README에 그대로 복붙 가능하게 정리.

---

## 4. 환경 분리

```
.env.dev      # 로컬 개발 (목 데이터, 로깅 verbose)
.env.staging  # 사내 테스트 (실 API, 디버그 가능)
.env.prod     # 실배포 (실 API, 디버그 차단)
```

- `.env.example` 만 git에 commit
- 실제 `.env*` 는 `.gitignore`
- API 키/시크릿은 **절대 커밋하지 않음**

---

## 5. 보안 체크리스트

- [ ] API 키가 코드에 하드코딩되어 있지 않은가
- [ ] `.gitignore` 에 `.env`, 인증서, keystore 포함
- [ ] 사용자 입력 검증 (XSS / SQLi / 경로 탈출)
- [ ] 통신 HTTPS 강제
- [ ] 로컬 저장 민감정보 암호화
- [ ] 로그에 비밀번호 / 토큰 출력 안 됨
- [ ] 권한 (카메라, 위치, 알림) 사유 명시

> Q&A 단골: "보안은 어떻게 챙기셨나요?"

---

## 6. 문서화 — 완성 기준

| 문서 | 완성 기준 |
|---|---|
| `README.md` | 5분 안에 프로젝트 이해 가능 |
| `docs/setup.md` | 처음 보는 사람이 실행 성공 |
| `docs/architecture.md` | 다이어그램 + 레이어별 책임 |
| `docs/deploy.md` | 명령어 복붙 가능 |
| `docs/testing.md` | 테스트 명령 + 커버리지 위치 |

---

## 7. README의 최소 구성

```markdown
# 프로젝트명

[한 줄 가치 제안]

## 스크린샷 / 데모
(이미지 또는 영상 링크)

## 주요 기능
- ...

## 기술 스택
- ...

## 빠른 시작
docs/setup.md 참고

## 빌드 / 배포
docs/deploy.md 참고

## 테스트
docs/testing.md 참고

## 라이선스
```

---

## 8. 최종 발표 준비 시작

다음 주가 **최종 평가**.

이번 주 안에:
1. 슬라이드 초안 완성 (12분 분량)
2. 1회 이상 시간 측정 리허설
3. 데모 영상 백업 (3분 mp4)
4. Q&A 30개 모두 답안 준비
5. 가산점 어필 슬라이드 1장

---

## 9. 이번 주 체크리스트

| 항목 | 완료 |
|---|---|
| Must + Should 모두 동작 |  |
| 빌드 명령 정상 작동 |  |
| 배포 산출물 (apk/ipa 등) 1개 이상 |  |
| README, setup, architecture, deploy, testing 모두 작성 |  |
| 보안 체크리스트 통과 |  |
| 최종 발표 슬라이드 초안 |  |
| 데모 영상 녹화 |  |

---

## 10. 다음 세션 (15주차)

- **최종 발표 평가**
- 팀당 12분 발표 + 8분 Q&A
- 2인 팀은 **두 명 모두 발표 (각자 12분)**
- 가산점 항목별 어필 시간 포함

---

## 함께 보는 자료

- `resources/01-deploy-guide.md` — 배포 가이드 (플랫폼별)
- `resources/02-security-checklist.md` — 보안 체크리스트
- `resources/03-readme-template.md` — README 템플릿
- `resources/04-final-presentation-template.md` — 최종 발표 템플릿
