## Getting Started on MacOS

Make sure you have XCode installed.

- `npm install -g cordova@10.0.0`
- From the parent directory run `npm run cordova-init`
- From the parent directory run `npm run cordova-build`
- Then, cd into this directory and run `cordova run ios`

If you get this error:

    xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance

See the first post in https://github.com/nodejs/node-gyp/issues/569 as a fix.

### Issues

If you face some issues with cordova, especially things like `deviceready has not been fired in 5 seconds` or something, remove all plugins and platforms and add them again.

```sh
cordova plugin save
cordova plugin remove ios
cordova platform remove android

cordova platform add ios
cordova plugin add android
```

### Building apps

You can use the following commands to build cordova app for production or staging in the root directory

```sh
npm run build-production-cordova
npm run build-staging-cordova
```

Then open xcode or android studio to build ios and android apps.

### Content update using Fastlane

If you are going to update the content of the app without releasing the app again, please run the following commands, each for ios and android.

```sh
bundle exec fastlane codepush_ios

bundle exec fastlane codepush_android
```
