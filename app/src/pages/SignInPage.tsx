import React from 'reactn'

import {
  Page,
  List,
  ListInput,
  Navbar,
  Link,
  Block,
  Button,
  BlockFooter,
  ListItem
} from 'framework7-react'

import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import './SignInPage.css'
import { signIn } from 'src/common/api'
import { i18n } from 'src/i18n'
import { Trans, t } from '@lingui/macro'
import { paths } from 'src/routes'

interface SignInState {
  emailOrMobile: string
  emailOrMobileValid: boolean
  password: string
  passwordValid: boolean
  rememberMe: boolean
}

export default class SignInPage extends React.Component<Record<string, any>, SignInState> {
  emailOrMobileRef = React.createRef<EmailOrPhoneListInput>()
  passwordRef = React.createRef<ListInput>()

  state: SignInState = {
    emailOrMobile: '',
    emailOrMobileValid: false,
    password: '',
    passwordValid: false,
    rememberMe: false
  }

  isValid() {
    return this.state.emailOrMobileValid && this.state.passwordValid
  }

  async signIn() {
    // TODO: Fix this hack.
    this.emailOrMobileRef.current?.validate(this.emailOrMobileRef.current?.state.value || '')
    // TODO: This doesn't show text.
    this.passwordRef.current?.onBlur()

    if (!this.isValid()) return
    try {
      await signIn(this.state.emailOrMobile, this.state.password, this.state.rememberMe)
    } catch (e) {
      const error = e.response.data
      console.error(error)
      this.$f7.dialog.alert('Username and password is incorrect', 'Sign In Failed')
    } 
  }

  render() {
    return (
      <Page className="SignInPage" noToolbar noSwipeback loginScreen>

        <Navbar title={
          i18n._(
            t('SignInPage.title')
            `Sign In`
          )} backLink="Back">
        </Navbar>
        
        <div className="greenlight-logo">
          Greenlight<span>.</span>
        </div>

        <List form>
          <EmailOrPhoneListInput
            ref={this.emailOrMobileRef}
            value={this.state.emailOrMobile}
            onInput={(e) => {
              this.setState({ emailOrMobile: e.target.value })
            }}
            onValidate={(isValid: boolean) => {
              this.setState({ emailOrMobileValid: isValid})
            }}
          />
          <ListInput
            type="password"
            ref={this.passwordRef}
            placeholder={
              i18n._(
                t('SignInPage.password_placeholder')
                `Password`
              )
            }
            validateOnBlur
            value={this.state.password}
            required
            onInput={e => {
              this.setState({ password: e.target.value })
            }}
            errorMessage={
              i18n._(
                t('SignInPage.password_missing')
                `Please enter your password.`
              )
            }
            onValidate={(isValid: boolean) => {
              this.setState({passwordValid: isValid})
            }}
          />
          <ListItem checkbox
            title={
              i18n._(
                t('SignInPage.remember_me')
                `Remember me`
              )
            }
            onInput={e => {
              this.setState({ rememberMe: e.target.value })
            }}
          />
          <Block>
            <Button outline fill onClick={() => this.signIn() }>
              <Trans id="SignInPage.sign_in">
                Sign In
              </Trans>
            </Button>
          </Block>
        </List>
        <List>
          <BlockFooter>
            <Link href={paths.passwordResetsNewPath}>
              <Trans id="SignInPage.forgot_password">
                Forgot password?
              </Trans>
            </Link>
          </BlockFooter>
        </List>
      </Page>
    )
  }
}
