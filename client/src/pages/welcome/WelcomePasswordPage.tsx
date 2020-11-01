import React from 'reactn';
import {
  Page, Navbar, Block, List, ListInput, Button, Toggle, ListItem,
} from 'framework7-react';
import { SyntheticEvent } from 'react';
import { updateUser } from 'src/api';
import { dynamicPaths } from 'src/routes';
import { User } from 'src/models';
import { ReactNComponent } from 'reactn/build/components';
import { NoCurrentUserError } from 'src/errors';

import { defineMessage, Trans } from '@lingui/macro';
import logger from 'src/logger';
import { When, Case } from '../../components/Case';

interface State {
  password: string
  errorMessage: string | null
  showErrorMessage: boolean
  isPasswordHidden: boolean
  currentUser: User
}

export default class extends ReactNComponent<any, State> {
  constructor(props: any) {
    super(props);

    if (!this.global.currentUser) {
      throw new NoCurrentUserError();
    }

    this.state = {
      password: '',
      errorMessage: null,
      showErrorMessage: false,
      isPasswordHidden: true,
      currentUser: this.global.currentUser,
    };
  }

  toggleReveal(e: SyntheticEvent) {
    this.setState({ isPasswordHidden: !(e.target as any).checked });
    // this.$f7.input.validateInputs('#WelcomePasswordPage-form')
  }

  async submit() {
    if (this.state.password.length < 8) {
      this.setState({
        errorMessage: this.global.i18n._(defineMessage({ id: 'WelcomePasswordPage.short_password', message: 'Password is too short.' })),
        showErrorMessage: true,
      });
      return;
    }
    this.setState({ errorMessage: '', showErrorMessage: false });
    this.$f7.input.validateInputs('#WelcomePasswordPage-form');

    this.$f7.dialog.preloader(this.global.i18n._(defineMessage({ id: 'WelcomePasswordPage.submitting_changes', message: 'Submitting changes...' })));
    try {
      const user = await updateUser(this.state.currentUser, { password: this.state.password } as Partial<User>);
      this.setGlobal({ currentUser: user });
      this.$f7.dialog.close();
      this.$f7router.navigate(dynamicPaths.afterWelcomePasswordPath());
    } catch (error) {
      this.$f7.dialog.close();
      logger.error(error);
      this.$f7.dialog.alert(
        this.global.i18n._(defineMessage({ id: 'WelcomePasswordPage.somethings_wrong', message: 'Something went wrong' })),
        this.global.i18n._(defineMessage({ id: 'WelcomePasswordPage.update_failed', message: 'Update Failed' })),
      );
    }
  }

  render() {
    return (
      <Page>
        <Navbar title={this.global.i18n._(defineMessage({ id: 'WelcomePasswordPage.set_password', message: 'Set Your Password' }))} />
        <Block>
          <p>
            <Trans id="WelcomePasswordPage.set_password_instructions">
              You can sign in with your email address or mobile number and this
              password. It must be at least 8 characters long.
            </Trans>
          </p>
        </Block>
        <Block>
          <List noHairlines form id="WelcomePasswordPage-form">
            <ListInput
              label={this.global.i18n._(defineMessage({ id: 'WelcomePasswordPage.password_label', message: 'Password' }))}
              type={this.state.isPasswordHidden ? 'password' : 'text'}
              placeholder={this.global.i18n._(defineMessage({ id: 'WelcomePasswordPage.password_placeholder', message: 'Password' }))}
              value={this.state.password}
              errorMessage={this.state.errorMessage || ''}
              errorMessageForce={this.state.showErrorMessage}
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
              required
              validate
            />

            <ListItem>
              <span><Trans id="WelcomePassword.reveal_password">Reveal Password</Trans></span>
              {/*  TODO: This color is off */}
              <Toggle color="green" onChange={(e) => this.toggleReveal(e)} />
            </ListItem>
          </List>
          <img
            alt={this.global.i18n._(
              defineMessage({ id: 'WelcomePasswordPage.security_alt_text', message: 'Greenlight gives security the highest importance.' }),
            )}
            src="/images/welcome-secure.svg"
          />

          <Case test={this.state.currentUser.children.length > 0}>
            <When value>
              <p>
                <Trans id="WelcomePasswordPage.next_children">
                  Next you'll review your children.
                </Trans>
              </p>

            </When>
            <When value={false}>
              <p>
                <Trans id="WelcomePasswordPage.next_survey">
                  Next you'll fill out your first survey!
                </Trans>
              </p>
            </When>
          </Case>

          <Button large fill onClick={() => this.submit()}>
            <Trans id="WelcomePasswordPage.continue">Continue</Trans>
          </Button>

        </Block>
      </Page>
    );
  }
}