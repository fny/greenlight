import React from 'reactn'
import {
  Page,
  List,
  Navbar,
  Block,
  Button,
  ListItem
} from 'framework7-react'

import { Trans, t } from '@lingui/macro'
import { i18n } from 'src/i18n'

import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import './MagicSignInPage.css'
import { Dict } from 'src/common/types'
import { createMagicSignIn } from 'src/common/api'

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
      const alertTitle = i18n._(t('MagicSignInPage.sign_in_sent')`Magic Sign In Sent`)
      if (this.state.emailOrMobile.includes('@')) {
        this.$f7.dialog.alert(
          i18n._(
            t('MagicSignInPage.will_get_email')
            `You should receive an email shortly with a magic sign in link.`), 
            alertTitle)
      } else {
        this.$f7.dialog.alert(
          i18n._(
            t('MagicSignInPage.will_get_text')
            `You should receive a text shortly with a magic sign in link.`), 
            alertTitle)
      }
    } catch (e) {
      console.error(e.response)
      this.$f7.dialog.alert(
        i18n._(
          t('MagicSignInPage.failed_setup')
          `We couldn't set up a magic sign for that info.`),
        i18n._(t('MagicSignInPage.sign_in_failed')`Magic Sign In Failed`))
    }
  }

  render() {
    return (
      <Page className="MagicSignInPage" noToolbar noSwipeback loginScreen>
        <Navbar title={i18n._(t('MagicSignInPage.title')`Magic Sign In`)} backLink="Back"></Navbar>
        <div className="greenlight-logo">
          Greenlight<span>.</span>
        </div>
        <List form>
          <Block>
            <Trans id="MagicSignInPage.directions">
              Enter your email or mobile number, and we'll send you a magic sign in link.
            </Trans>
          </Block>
          <EmailOrPhoneListInput 
            value={this.state.emailOrMobile}
            ref={this.emailOrMobileRef}
            onInput={(e) => {
              this.setState({ emailOrMobile: e.target.value })
            }}
          />
          <ListItem checkbox title={i18n._(t('MagicSignInPage.remember_me')`Remember Me`)}
            onInput={e => {
              this.setState({ rememberMe: e.target.value })
            }}
          ></ListItem>
          <Block>
            <Button outline fill onClick={() => { this.submit() }}>
              <Trans id="MagicSignInPage.request_magic_link">
                Request Magic Link
              </Trans>
            </Button>
          </Block>
        </List>
      </Page>
    )
  }
}
