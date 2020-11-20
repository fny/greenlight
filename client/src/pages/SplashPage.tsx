import React from 'reactn'
import {
  Page,
  Block,
  Button,
} from 'framework7-react'

import './SplashPage.css'
import { toggleLocale } from 'src/initializers/providers'
import { Trans } from '@lingui/macro'
import releaseData from 'src/data/releases'
import { paths } from 'src/routes'

export default class SplashPage extends React.Component<any, any> {
  render() {
    return (
      <Page className="SplashPage" noToolbar noNavbar noSwipeback loginScreen>
        <Block>
          <div className="welcome">
            <Trans id="SplashPage.welcome">Welcome to</Trans>
          </div>
          <div className="logo">
            Greenlight
            <span>.</span>
          </div>

          <Button outline href={paths.signInPath}>
            <Trans id="SplashPage.sign_in">
              Sign In
            </Trans>
          </Button>

          <Button outline href={paths.newUserPath}>
            <Trans id="SplashPage.create_account">
              Create Account
            </Trans>
          </Button>
          <Button outline href={paths.durhamRegistationPath}>
            <Trans id="SplashPage.register_business">
              Register Business
            </Trans>
          </Button>

          <Button outline onClick={() => toggleLocale()} style={{ border: 0 }}>
            <Trans id="SplashPage.choose_language">
              En Español
            </Trans>
          </Button>
        </Block>

        <p className="copyright">
          &copy;
          {(new Date()).getFullYear()}
          {' '}
          Greenlight Ready LLC<br />
          <Trans id="Common.version">Version</Trans>
          {' '}
          {releaseData[0].version}
        </p>
      </Page>
    )
  }
}
