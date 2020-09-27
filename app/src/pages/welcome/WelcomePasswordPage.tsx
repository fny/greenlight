import React from 'reactn'
import { Page, Navbar, Block, List, ListInput, Button, Toggle, ListItem } from 'framework7-react'
import { When, Case } from '../../components/Case'
import { SyntheticEvent } from 'react'
import { updateUser } from 'src/common/api'
import { dynamicPaths } from 'src/routes'
import { User } from 'src/common/models'

import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'


interface State {
  password: string
  errorMessage: string | null
  showErrorMessage: boolean
  isPasswordHidden: boolean
}

export default class extends React.Component<any, State> {
  state: State = {
    password: '',
    errorMessage: null,
    showErrorMessage: false,
    isPasswordHidden: true
  }
  toggleReveal(e: SyntheticEvent) {
    this.setState({ isPasswordHidden: !(e.target as any).checked })
    // this.$f7.input.validateInputs('#WelcomePasswordPage-form')
  }
  async submit() {
    if (this.state.password.length < 8) {
      this.setState({ 
        errorMessage: i18n._(t("WelcomePasswordPage.short_password")`Password is too short.`), 
        showErrorMessage: true })
      return
    }
    this.setState({ errorMessage: '', showErrorMessage: false })
    this.$f7.input.validateInputs('#WelcomePasswordPage-form')

    this.$f7.dialog.preloader(i18n._(t('WelcomePasswordPage.submitting_changes')`Submitting changes...`))
    try {
      const user = await updateUser(this.global.currentUser, { password: this.state.password } as Partial<User>)
      this.setGlobal({ currentUser: user })
      this.$f7.dialog.close()
      this.$f7router.navigate(dynamicPaths.afterWelcomePasswordPath())
    } catch (error) {
      this.$f7.dialog.close()
      console.error(error)
      this.$f7.dialog.alert(
        i18n._(t('WelcomePasswordPage.somethings_wrong')`Something went wrong`),
        i18n._(t('WelcomePasswordPage.update_failed')`Update Failed`))
    }
  }

  render() {
    return (
      <Page>
        <Navbar title={i18n._(t('WelcomePasswordPage.set_password')`Set Your Password`)}></Navbar>
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
            label={i18n._(t('WelcomePasswordPage.password_label')`Password`)}
            type={this.state.isPasswordHidden ? "password" : "text"} 
            placeholder={i18n._(t('WelcomePasswordPage.password_placeholder')`Password`)}
            value={this.state.password}
            errorMessage={this.state.errorMessage || ''}
            errorMessageForce={this.state.showErrorMessage}
            onChange={(e) => {
              this.setState({ password: e.target.value })
            }}
            required
            validate
          />

          <ListItem>
            <span>Reveal Password</span>
            {/*  TODO: This color is off */}
            <Toggle color="green" onChange={(e) => this.toggleReveal(e)} />
          </ListItem>
          </List>
          <img
            alt={i18n._(
              t('WelcomePasswordPage.security_alt_text')
              `Greenlight gives security the highest importance.`)}
            src="/images/welcome-secure.svg"
          />

          <Case test={this.global.currentUser.children.length > 0}>
            <When value={true}>
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
    )
  }
}
