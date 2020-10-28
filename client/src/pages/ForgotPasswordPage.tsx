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
import { Trans } from '@lingui/macro'
import { MyTrans } from 'src/i18n'

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
            <MyTrans id="ForgotPasswordPage.instructions">
              Enter your email or mobile number, and we'll send you a link to reset
              your password.
            </MyTrans>
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
    const app = this.$f7
    const router = this.$f7router
    app.dialog.alert(`You should be recieving an email or text soon.`, () => {
      router.back()
    })
  }
}
