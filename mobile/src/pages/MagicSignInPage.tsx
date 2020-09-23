import React from 'reactn'
import {
  Page,
  List,
  Navbar,
  Block,
  Button,
} from 'framework7-react'

import { Trans, t } from '@lingui/macro'
import { i18n } from 'src/i18n'

import EmailOrPhoneListInput, { EmailOrPhoneInputTypes } from 'src/components/EmailOrPhoneListInput'
import './MagicSignInPage.css'
import { ObjectMap } from 'src/common/types'

interface State {
  emailOrMobile: string
  emailOrMobileValid: boolean
  rememberMe: boolean
  submitted: boolean
}

export default class MagicSignInPage extends React.Component<ObjectMap<any>, State> {
  emailOrMobileRef = React.createRef<EmailOrPhoneListInput>()
  
  state: State = {
    emailOrMobile: '',
    emailOrMobileValid: false,
    rememberMe: false,
    submitted: false
  }

  submit() {
    const input = this.emailOrMobileRef.current
    if (!input) return
    const isValid = input.validate(input.state.value || '')
    if (!isValid) return
    

    
    // Make request, return error if email is not found
    // add notice that they should receive email/phone in a bit
    // hide buttons
    // new page
    // add button to resend
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
          <li>
            <EmailOrPhoneListInput value="" ref={this.emailOrMobileRef} />
          </li>
          <Block>
            <Button outline fill onClick={this.submit}>
              <Trans id="MagicSignInPage.request_magic_link">
                Request Magic Link
              </Trans>
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
