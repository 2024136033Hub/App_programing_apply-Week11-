# 배포 가이드 (플랫폼별)

## Flutter

### Android (APK)
```bash
flutter build apk --release --split-per-abi
# → build/app/outputs/flutter-apk/
```

### Android (AAB, Play Store)
```bash
flutter build appbundle --release
# 서명 키: android/key.properties (gitignore)
```

### iOS (실기 또는 TestFlight)
```bash
flutter build ios --release
open ios/Runner.xcworkspace
# Xcode에서 Archive → Distribute
```

## React Native (Expo)

### EAS Build (가장 권장)
```bash
npx eas build --profile preview --platform android
npx eas build --profile production --platform ios
```

### Expo Go 미리보기 (학습용)
```bash
npx expo start
# QR 코드로 본인 폰에서 즉시
```

## React Native (Bare)

```bash
# Android
cd android && ./gradlew assembleRelease

# iOS
cd ios && xcodebuild -workspace ...
```

## Android Native (Kotlin)

```bash
./gradlew assembleRelease
# build/outputs/apk/release/

./gradlew bundleRelease
# build/outputs/bundle/release/
```

## iOS Native (Swift)

- Xcode → Product → Archive
- Distribute App → Ad Hoc / TestFlight / App Store

## 서명 / 인증서

| 플랫폼 | 필요한 것 |
|---|---|
| Android | keystore (.jks), `key.properties` |
| iOS | Apple Developer 계정, 인증서, Provisioning Profile |

> keystore와 비밀번호는 **절대** git에 커밋 금지.
> `.gitignore` 와 secrets 관리 도구(GitHub Actions secrets, EAS secrets) 사용.

## 배포 전 최종 체크

- [ ] 버전 번호 올림 (SemVer)
- [ ] 변경 로그 작성
- [ ] 디버그 로그 / `console.log` 제거
- [ ] 디버그 메뉴 / 백도어 제거
- [ ] 프로덕션 환경 변수 설정 확인
- [ ] 크래시 리포팅 활성화 (선택)
- [ ] 분석 / 추적 동의 처리 (선택)

## CI/CD (선택, 가산점 인상)

GitHub Actions 예 — `.github/workflows/build.yml`:
```yaml
name: Build
on:
  push:
    tags: ['v*']
jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: subosito/flutter-action@v2
      - run: flutter build apk --release
      - uses: actions/upload-artifact@v4
        with:
          name: app-release
          path: build/app/outputs/flutter-apk/
```
