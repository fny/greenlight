import React, { useState, getGlobal } from 'reactn'
import {
  Page,
  List,
  LoginScreenTitle,
  ListInput,
  Row,
  Col,
  Navbar,
  Link,
  Block,
  BlockTitle,
  Segmented,
  Button,
  ListButton,
  BlockFooter,
  ListItem,
} from 'framework7-react'

import './SplashPage.css'

interface SplashProps {}
interface SplashState {
}

export default class SplashPage extends React.Component<
  SplashProps,
  SplashState
> {
  state: SplashState = {
  }

  render() {
    return (
      <Page className="SplashPage" noToolbar noNavbar noSwipeback loginScreen>
        <Block>
          <div className="welcome">Welcome to</div>
          <div className="logo">
            Greenlight<span>.</span>
          </div>
          <br />
          <br />
          <br />
          <Button outline href="/sign-in">Sign In with Password</Button>
          <Button outline href="/magic-sign-in">Magic Sign In</Button>
          <Button outline href="/join">Join Greenlight</Button>
        </Block>
      </Page>
    )
  }
}
