# Le Poulailler - Coworking Metz Mobile

![Coworking Mobile Banner](./docs/coworking-mobile-banner.gif)

This project holds the Coworking Metz mobile application source code.

## Getting Started

These instructions will give you a copy of the project up and running on
your local machine for development and testing purposes.

### Prerequisites

Requirements for the software and other tools to build, test and push

- [Git](https://git-scm.com/) - Version control system
- [Docker](https://www.docker.com/) - Container platform
- [Node](https://nodejs.org/en) - Cross-platform JavaScript runtime environment
- [expo](https://docs.expo.dev/) - Platform for making universal native apps

### Install

A step by step series of examples that tell you how to get a development environment running:

```bash
git clone git@github.com:coworking-metz/mobile-app.git
cd mobile-app
npm i
```

### Start the project

```bash
npm start
```

### Mock the API

In case you don't want to rely on the API, you can start [`mockoon`](https://mockoon.com) through `docker-compose`
which will mock the responses with random data.
Any credentials will work during the login flow.

```bash
docker-compose -f mock/docker-compose.yml up -d
```

## Deploy

Everything is done through [Expo Application Services](https://docs.expo.dev/guides/overview/).
You can install it locally by doing:
```bash
npm i -g eas
```

### Build iOS locally

```bash
SENTRY_DISABLE_AUTO_UPLOAD=true eas build --profile preview --platform ios --local
```
Then:
- launch `Xcode`
- navigate to `Window` -> `Devices and Simulators` -> `Devices`
- select your device
- finally drag and drop the `.ipa` file in the `Installed Apps` section

### Build Android locally

```bash
SENTRY_DISABLE_AUTO_UPLOAD=true eas build --profile preview --platform android --local
adb install build-*.apk
```

### Build for staging

```bash
eas build --profile preview --platform all
eas build --profile preview --platform ios # only for iOS
eas build --profile preview --platform android # only for Android
```

### Versioning

- Change `expo.version` in [`app.json`](./app.json) to whatever you feel like.
- Reflect the change on `version` in [`package.json`](./package.json).
- Change [`CHANGELOG.md`](./CHANGELOG.md) accordingly.
- Commit & tag it
```bash
(TAG=1.1.0; git add app.json package.json package-lock.json CHANGELOG.md && git commit -m "chore(version): update to $TAG" && git tag -a $TAG -m "$TAG")
git push origin --tags
```

### Build for production

```bash
eas build --profile production --platform all
```

### Submit to the App Store and Play Store

```bash
eas submit
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- [README-Template](https://github.com/PurpleBooth/a-good-readme-template) for what you're reading

