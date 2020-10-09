import React from 'reactn'
import {
  Page,
  Block,
  Button
} from 'framework7-react'

import { Trans } from '@lingui/macro'

import './SplashPage.css'
import { toggleLocale } from '../util'

export default class SplashPage extends React.Component<{}, {}> {
  render() {
    return (
      <Page className="SplashPage" noToolbar noNavbar noSwipeback loginScreen>
        <Block>
          <div className="welcome">
            <Trans id="SplashPage.welcome">Welcome to</Trans>
          </div>
          <div className="logo">
            Greenlight<span>.</span>
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

          <Button outline onClick={toggleLocale}>
            <Trans id="SplashPage.choose_language">
              En Español
            </Trans>
          </Button>
        </Block>
      </Page>
    )
  }
}
