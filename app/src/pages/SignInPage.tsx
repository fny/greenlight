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
import { paths, dynamicPaths } from 'src/routes'

interface SignInState {
  emailOrMobile: string
  password: string
  rememberMe: boolean
}

export default class SignInPage extends React.Component<Record<string, any>, SignInState> {
  emailOrMobileRef = React.createRef<EmailOrPhoneListInput>()
  passwordRef = React.createRef<ListInput>()

  state: SignInState = {
    emailOrMobile: '',
    password: '',
    rememberMe: false
  }

  validate() {
    const passwordValid = this.$f7.input.validateInputs('#sign-in-form')
    const emailOrMobileValid = this.emailOrMobileRef.current?.validate(this.emailOrMobileRef.current?.state.value || '')
    return passwordValid && emailOrMobileValid
  }

  // TODO: Reactor: Extract this pattern
  async submit() {
    if (!this.validate()) { 
      return
    }
    this.$f7.dialog.preloader('Signing you in...')
    try {
      const user = await signIn(this.state.emailOrMobile, this.state.password, this.state.rememberMe)
      this.$f7.dialog.close()
      this.setGlobal({ currentUser: user })
      this.$f7router.navigate(dynamicPaths.currentUserHomePath())
    } catch (error) {
      this.$f7.dialog.close()
      console.error(error)
      // TODO: i18n
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

        <List form id="sign-in-form">
          <EmailOrPhoneListInput
            ref={this.emailOrMobileRef}
            value={this.state.emailOrMobile}
            onInput={(e) => {
              this.setState({ emailOrMobile: e.target.value })
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
          />
          <ListItem checkbox
            title={
              i18n._(
                t('SignInPage.remember_me')
                `Remember me`
              )
            }
            onChange={e => {
              this.setState({ rememberMe: e.target.checked })
            }}
          />
          <Block>
            <Button outline fill onClick={() => this.submit() }>
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
