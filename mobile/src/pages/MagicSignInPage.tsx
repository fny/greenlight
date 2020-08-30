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

import EmailOrPhoneInput from '../components/EmailOrPhoneInput'
import './MagicSignInPage.css'

interface MagicSignInProps {}
interface MagicSignInState {
}

export default class MagicSignInPage extends React.Component<
  MagicSignInProps,
  MagicSignInState
> {
  state: MagicSignInState = {
  }

  render() {
    return (
      <Page className="MagicSignInPage" noToolbar noSwipeback loginScreen>
        <Navbar title="Magic Sign In" backLink="Back"></Navbar>
        <div className="greenlight-logo">
          Greenlight<span>.</span>
        </div>
        <List form>
          <Block>
            Enter your email or mobile number, and we'll send you a magic sign in link.
          </Block>
          <li>
            <EmailOrPhoneInput value="" />
          </li>
          <Block>
            <Button outline fill>
              Request Magic Link
            </Button>
          </Block>
        </List>
      </Page>
    )
  }
  signIn() {
    const self = this
    const app = self.$f7
    const router = self.$f7router
    app.dialog.alert(
      `You should be recieving an email or text soon.`,
      () => {
        router.back()
      }
    )
  }
}
