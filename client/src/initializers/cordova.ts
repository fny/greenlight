import logger from 'src/helpers/logger'
import env from 'src/config/env'
import { assertNotNull } from 'src/helpers/util'

import { f7ready } from 'framework7-react'
import Framework7 from 'framework7/framework7.esm.bundle'

interface CordovaAppOptions {
  startApp: () => any
}
class CordovaApp {
  private options: CordovaAppOptions | null = null
  private f7Instance: Framework7 | null = null
  private nextRoute: string | null = null

  public initialize(options: CordovaAppOptions) {
    this.options = options

    // Check token if it is cordova
    const rememberMe = localStorage.getItem('rememberMe')
    if (rememberMe !== 'true') {
      localStorage.clear()
    }

    // get f7 instance
    f7ready((f7) => {
      logger.log('f7 ready')
      this.f7Instance = f7
      setTimeout(() => {
        if (this.nextRoute) {
          this.f7Instance?.view.current.router.navigate(this.nextRoute)
        }
      })
    })

    this.bindEvents()
  }

  private bindEvents() {
    document.addEventListener('deviceready', () => this.onDeviceReady(), false)
    document.addEventListener('resume', () => this.onResume(), false)
  }

  // app events
  private onDeviceReady() {
    assertNotNull(this.options)

    logger.log('onDeviceReady', this, (window as any).IonicDeeplink)
    this.options.startApp()
    this.handleDeepLinks()
  }

  private onResume() {
    logger.log('onResume')
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
    const IonicDeeplink = (window as any).IonicDeeplink

    IonicDeeplink.route(
      ['/pwdrst/:token', '/mgk/:token/:remember', '/go/:loaction_permalink', '/d/:action'],
      (match: any) => {
        logger.log('matched', match)
        if (this.f7Instance) {
          this.f7Instance.view.current.router.navigate(match.$link.path)
          this.nextRoute = null
        } else {
          this.nextRoute = match.$link.path
        }
      },
      (nomatch: any) => {},
    )
  }
}

const cordovaApp = new CordovaApp()

export default cordovaApp
