# 보안 체크리스트

OWASP Mobile Top 10을 본 프로젝트 규모에 맞게 압축.

## 1. 비밀 관리

- [ ] API 키 / 토큰이 코드에 **하드코딩되어 있지 않은가**
- [ ] `.env`, keystore, p12, mobileprovision 모두 `.gitignore`
- [ ] git history에 한 번이라도 commit된 비밀이 있는지 확인 (`git log -p | grep -i secret`)
- [ ] 노출된 적 있다면 **즉시 키 회전(rotate)**

## 2. 입력 검증

- [ ] 사용자 입력의 길이 / 형식 / 범위 검증
- [ ] 정규식은 ReDoS 안전한가
- [ ] 파일 경로 입력에 `..` 차단

## 3. 통신

- [ ] HTTPS만 사용
- [ ] 인증서 검증 비활성화 코드가 없는가
- [ ] 토큰은 헤더로, URL 쿼리 X
- [ ] 인증 토큰 만료 / 갱신 로직

## 4. 로컬 저장

- [ ] 비밀번호 평문 저장 X
- [ ] 토큰은 `Keychain` (iOS) / `EncryptedSharedPreferences` (Android) / `flutter_secure_storage`
- [ ] 캐시에 민감정보 노출되지 않는가

## 5. 로그

- [ ] 비밀번호 / 토큰 / PII가 로그에 안 찍히는가
- [ ] 릴리스 빌드에서는 디버그 로그 차단

## 6. 권한

- [ ] 사용하지 않는 권한 요청 안 함
- [ ] 사용 사유를 사용자에게 명시
- [ ] 권한 거절 시 graceful fallback

## 7. 의존성

- [ ] 알려진 취약점 스캔 (`npm audit`, `dart pub outdated`, `gradle dependencies`)
- [ ] 활발히 유지보수되는 패키지인지 확인

## 8. 앱 자체

- [ ] 백그라운드 진입 시 민감 화면 가림 (스냅샷 보호)
- [ ] 루팅/탈옥 디바이스 탐지 (선택)
- [ ] 디버거 부착 탐지 (선택)

## Q&A 단골

> "보안은 어떻게 챙기셨나요?"

→ 위 8개 영역 중 본인이 적용한 것 3개만 또렷이 답변
