import React from 'reactn'
import {
  Page,
  Block,
  Button,
} from 'framework7-react'

import './SplashPage.css'
import { MyTrans, toggleLocale } from 'src/i18n'

export default class SplashPage extends React.Component<any, any> {
  render() {
    return (
      <Page className="SplashPage" noToolbar noNavbar noSwipeback loginScreen>
        <Block>
          <div className="welcome">
            <MyTrans id="SplashPage.welcome">Welcome to</MyTrans>
          </div>
          <div className="logo">
            Greenlight<span>.</span>
          </div>

          <Button outline href="/sign-in">
            <MyTrans id="SplashPage.sign_in">
              Sign In with Password
            </MyTrans>
          </Button>

          <Button outline href="/magic-sign-in">
            <MyTrans id="SplashPage.magic_sign_in">
              Magic Sign In
            </MyTrans>
          </Button>

          <Button outline onClick={() => toggleLocale()}>
            <MyTrans id="SplashPage.choose_language">
              En Español
            </MyTrans>
          </Button>
        </Block>
        <p className="copyright">
          &copy;{(new Date()).getFullYear()} Greenlight Ready LLC
        </p>
      </Page>
    )
  }
}
