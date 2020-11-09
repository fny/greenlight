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

          <Button outline href="/sign-in">
            <Trans id="SplashPage.sign_in">
              Sign In with Password
            </Trans>
          </Button>

          <Button outline href="/magic-sign-in">
            <Trans id="SplashPage.magic_sign_in">
              Magic Sign In
            </Trans>
          </Button>

          <Button outline onClick={() => toggleLocale()}>
            <Trans id="SplashPage.choose_language">
              En Español
            </Trans>
          </Button>
        </Block>
        <p className="copyright">
          &copy;
          {(new Date()).getFullYear()}
          {' '}
          Greenlight Ready LLC
        </p>
        <p className="version">
          <Trans id="Common.version">Version</Trans>
          {' '}
          {releaseData[0].version}
        </p>
      </Page>
    )
  }
}
