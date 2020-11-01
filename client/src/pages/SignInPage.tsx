import React from 'reactn';

import {
  Page,
  List,
  ListInput,
  Navbar,
  Link,
  Block,
  Button,
  BlockFooter,
  ListItem,
} from 'framework7-react';

import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput';
import './SignInPage.css';
import { createSession, getCurrentUser } from 'src/api';
import { defineMessage, Trans } from '@lingui/macro';
import { paths, dynamicPaths } from 'src/routes';
import logger from 'src/logger';

interface SignInState {
  emailOrMobile: string
  password: string
  rememberMe: boolean
}

export default class SignInPage extends React.Component<Record<string, any>, SignInState> {
  emailOrMobileRef = React.createRef<EmailOrPhoneListInput>();

  passwordRef = React.createRef<ListInput>();

  state: SignInState = {
    emailOrMobile: '',
    password: '',
    rememberMe: false,
  };

  validate() {
    const passwordValid = this.$f7.input.validateInputs('#sign-in-form');
    const emailOrMobileValid = this.emailOrMobileRef.current?.validate(this.emailOrMobileRef.current?.state.value || '');
    return passwordValid && emailOrMobileValid;
  }

  // TODO: Refactor: Extract this pattern
  // TODO: Improve error messages
  async submit() {
    if (!this.validate()) {
      return;
    }
    this.$f7.dialog.preloader(
      this.global.i18n._(defineMessage({ id: 'SignInPage.signing_you_in', message: 'Signing you in...' })),
    );
    try {
      await createSession(this.state.emailOrMobile, this.state.password, this.state.rememberMe);

      const user = await getCurrentUser();
      this.$f7.dialog.close();
      this.setGlobal({ currentUser: user });
      this.$f7router.navigate(dynamicPaths.currentUserHomePath());
    } catch (error) {
      this.$f7.dialog.close();
      logger.error(error);
      this.$f7.dialog.alert(
        this.global.i18n._(defineMessage({ id: 'SignInPage.credentials_incorrect', message: 'The credentials your provided are incorrect.' })),
        this.global.i18n._(defineMessage({ id: 'SignInPage.sign_in_failed', message: 'Sign In Failed' })),
      );
    }
  }

  render() {
    return (
      <Page className="SignInPage" noToolbar>

        <Navbar
          title={
          this.global.i18n._(
            defineMessage({ id: 'SignInPage.title', message: 'Sign In' }),
          )
}
          backLink="Back"
        />

        <div style={{ marginTop: '20px' }} className="greenlight-logo">
          Greenlight
          <span>.</span>
        </div>

        <List form id="sign-in-form">
          <EmailOrPhoneListInput
            ref={this.emailOrMobileRef}
            value={this.state.emailOrMobile}
            onInput={(e) => {
              this.setState({ emailOrMobile: e.target.value });
            }}
          />
          <ListInput
            type="password"
            ref={this.passwordRef}
            placeholder={
              this.global.i18n._(
                defineMessage({ id: 'SignInPage.password_placeholder', message: 'Password' }),
              )
            }
            validateOnBlur
            value={this.state.password}
            required
            onInput={(e) => {
              this.setState({ password: e.target.value });
            }}
            errorMessage={
              this.global.i18n._(
                defineMessage({ id: 'SignInPage.password_missing', message: 'Please enter your password.' }),
              )
            }
          />
          <ListItem
            checkbox
            title={
              this.global.i18n._(
                defineMessage({ id: 'SignInPage.remember_me', message: 'Remember me' }),
              )
            }
            onChange={(e) => {
              this.setState({ rememberMe: e.target.checked });
            }}
          />
          <Block>
            <Button outline fill onClick={() => this.submit()}>
              <Trans id="SignInPage.sign_in">
                Sign In
              </Trans>
            </Button>
          </Block>
        </List>
        <List>
          <BlockFooter>
            <Link href={paths.magicSignInPath}>
              <Trans id="SignInPage.forgot_password">
                Forgot password?
              </Trans>
            </Link>
          </BlockFooter>
        </List>
      </Page>
    );
  }
}