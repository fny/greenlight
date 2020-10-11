import React from 'reactn'
import {
  Page,
  List,
  Navbar,
  Block,
  Button,
  ListItem
} from 'framework7-react'

import { Trans, defineMessage } from '@lingui/macro'

import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import './MagicSignInPage.css'
import { Dict } from 'src/common/types'
import { createMagicSignIn } from 'src/common/api'
import { MyTrans } from 'src/i18n'

interface State {
  emailOrMobile: string
  rememberMe: boolean
  submitted: boolean
}

export default class MagicSignInPage extends React.Component<Dict<any>, State> {
  emailOrMobileRef = React.createRef<EmailOrPhoneListInput>()

  state: State = {
    emailOrMobile: '',
    rememberMe: false,
    submitted: false
  }

  async submit() {
    const input = this.emailOrMobileRef?.current
    if (!input) {
      console.error("Reference to input not created")
      return
    }
    const isValid = input.validate(input.state.value || '')
    if (!isValid) return
    try {
      await createMagicSignIn(this.state.emailOrMobile, this.state.rememberMe)
      const alertTitle = this.global.i18n._(defineMessage({ id: 'MagicSignInPage.sign_in_sent', message: "Magic Sign In Sent" }))
      if (this.state.emailOrMobile.includes('@')) {
        this.$f7.dialog.alert(
          this.global.i18n._(
            defineMessage({ id: 'MagicSignInPage.will_get_email', message: "You should receive an email shortly with a magic sign in link." })),
            alertTitle)
      } else {
        this.$f7.dialog.alert(
          this.global.i18n._(
            defineMessage({ id: 'MagicSignInPage.will_get_text', message: "You should receive a text shortly with a magic sign in link." })),
            alertTitle)
      }
    } catch (e) {
      console.error(e.response)
      this.$f7.dialog.alert(
        this.global.i18n._(
          defineMessage({ id: 'MagicSignInPage.failed_setup', message: "We couldn't set up a magic sign for that info." })),
        this.global.i18n._(
          defineMessage({ id: 'MagicSignInPage.sign_in_failed', message: "Magic Sign In Failed" })))
    }
  }

  render() {
    return (
      <Page className="MagicSignInPage" noToolbar noSwipeback loginScreen>
        <Navbar title={this.global.i18n._(defineMessage({ id: 'MagicSignInPage.title', message: "Magic Sign In" }))} backLink="Back"></Navbar>
        <div className="greenlight-logo">
          Greenlight<span>.</span>
        </div>
        <List form>
          <Block>
            <MyTrans id="MagicSignInPage.directions">
              Enter your email or mobile number, and we'll send you a magic sign in link.
            </MyTrans>
          </Block>
          <EmailOrPhoneListInput
            value={this.state.emailOrMobile}
            ref={this.emailOrMobileRef}
            onInput={(e) => {
              this.setState({ emailOrMobile: e.target.value })
            }}
          />
          <ListItem checkbox title={this.global.i18n._(defineMessage({ id: 'MagicSignInPage.remember_me', message: "Remember Me" }))}
            onInput={e => {
              this.setState({ rememberMe: e.target.value })
            }}
          ></ListItem>
          <Block>
            <Button outline fill onClick={() => { this.submit() }}>
              <MyTrans id="MagicSignInPage.request_magic_link">
                Request Magic Link
              </MyTrans>
            </Button>
          </Block>
        </List>
      </Page>
    )
  }
}
