import React from 'reactn'
import {
  Page,
  List,
  Navbar,
  Block,
  Button,
  ListItem,
} from 'framework7-react'

import { t, Trans } from '@lingui/macro'

import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import './MagicSignInPage.css'
import { Dict } from 'src/types'
import { createMagicSignIn } from 'src/api'
import { assertNotNull } from 'src/helpers/util'
import logger from 'src/helpers/logger'
import { paths } from 'src/config/routes'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import './SessionsPage.css'
import greenlightLogo from 'src/assets/images/logos/greenlight-banner-logo.svg'

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
    submitted: false,
  }

  async submit() {
    const input = this.emailOrMobileRef?.current

    assertNotNull(input)

    const isValid = input.validate(input.state.value || '')
    if (!isValid) return
    try {
      await createMagicSignIn(this.state.emailOrMobile, this.state.rememberMe)
      const alertTitle = t({ id: 'MagicSignInPage.sign_in_sent', message: 'Magic Sign In Sent' })
      if (this.state.emailOrMobile.includes('@')) {
        this.$f7.dialog.alert(
          t({ id: 'MagicSignInPage.will_get_email', message: 'You should receive an email shortly with a magic sign in link.' }),
          alertTitle,
        )
      } else {
        this.$f7.dialog.alert(
          t({ id: 'MagicSignInPage.will_get_text', message: 'You should receive a text shortly with a magic sign in link.' }),
          alertTitle,
        )
      }
    } catch (e) {
      logger.error(e.response)
      this.$f7.dialog.alert(
        t({ id: 'MagicSignInPage.failed_setup', message: "We couldn't set up a magic sign for that info." }),
        t({ id: 'MagicSignInPage.sign_in_failed', message: 'Magic Sign In Failed' }),
      )
    }
  }

  render() {
    return (
      <Page className="MagicSignInPage" noToolbar noSwipeback loginScreen>
        <Navbar
          title={t({ id: 'MagicSignInPage.title', message: 'Magic Sign In' })}
        >
          <NavbarHomeLink slot="left" />
        </Navbar>
        <div className="greenlight-logo">
          <img src={greenlightLogo} alt="Greenlight" />
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
          <ListItem
            checkbox
            title={t({ id: 'MagicSignInPage.remember_me', message: 'Remember Me' })}
            onInput={(e) => {
              this.setState({ rememberMe: e.target.value })
            }}
          />
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
