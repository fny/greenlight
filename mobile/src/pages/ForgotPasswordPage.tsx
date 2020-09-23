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

import EmailOrPhoneListInput from '../components/EmailOrPhoneListInput'

interface ForgotPasswordProps {}
interface ForgotPasswordState {}

export default class ForgotPasswordPage extends React.Component<
  ForgotPasswordProps,
  ForgotPasswordState
> {
  state: ForgotPasswordState = {}

  render() {
    return (
      <Page className="ForgotPasswordPage" noToolbar noSwipeback loginScreen>
        <Navbar title="Forgot Password" backLink="Back"></Navbar>
        <List form>
          <Block>
            Enter your email or mobile number, and we'll send you a link to reset
            your password.
          </Block>
          <li>
            <EmailOrPhoneListInput value="" />
          </li>
          <Block>
            <Button outline fill>
              Request Reset
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
    app.dialog.alert(`You should be recieving an email or text soon.`, () => {
      router.back()
    })
  }
}
