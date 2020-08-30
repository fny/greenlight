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

interface PasswordResetProps {}
interface PasswordResetState {}

// TODO: Password reset token must be valid.
export default class PasswordResetPage extends React.Component<
  PasswordResetProps,
  PasswordResetState
> {
  state: PasswordResetState = {}

  render() {
    return (
      <Page className="PasswordResetPage" noToolbar noSwipeback loginScreen>
        <Navbar title="Password Reset" backLink="Back"></Navbar>
        <List form>
          <Block>Enter a new password.</Block>
          {/* TODO: Allow reveal of passwords */}
          <ListInput type="password" placeholder="Password" />
          <ListInput type="password" placeholder="Password confirmation" />
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
