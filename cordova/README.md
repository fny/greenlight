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
cordova plugin remove ...
cordova platform remove ...

cordova platform add ...
cordova plugin add ...
```
