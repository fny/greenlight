import logger from 'src/helpers/logger'
import env from 'src/config/env'
import { assertNotNull } from 'src/helpers/util'

interface CordovaAppOptions {
  startApp: () => any
}

class CordovaApp {
  private options: CordovaAppOptions | null = null

  public initialize(options: CordovaAppOptions) {
    this.options = options

    // Check token if it is cordova
    const rememberMe = localStorage.getItem('rememberMe')
    if (rememberMe !== 'true') {
      localStorage.clear()
    }

    this.bindEvents()
  }

  private bindEvents() {
    document.addEventListener('deviceready', this.onDeviceReady, false)
    document.addEventListener('resume', this.onResume, false)
  }

  // app events
  private onDeviceReady() {
    assertNotNull(this.options)

    logger.log('onDeviceReady')
    this.handleDeepLinks()
    this.options.startApp()
  }

  private onResume() {
    logger.log('onResume')
    // this.handleCodePush()
  }

  // handlers
  private handleCodePush() {
    logger.log('resume')
    ;(window as any).codePush.checkForUpdate(
      function (update: boolean) {
        if (!update) {
          logger.log('The app is up to date.')
        } else {
          logger.log('An update is available! Should we download it?')
          ;(window as any).codePush.sync(
            null,
            {
              updateDialog: true,
              installMode: (window as any).InstallMode.IMMEDIATE,
              deploymentKey: env.codePushDeploymentKey(),
            },
            null,
            function (error: any) {
              logger.log('codepush sync error', error)
            },
          )
        }
      },
      null,
      env.codePushDeploymentKey(),
    )
  }

  private handleDeepLinks() {
    logger.log('handle deep links')
  }
}

const cordovaApp = new CordovaApp()
export default cordovaApp
