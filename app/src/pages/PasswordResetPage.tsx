import React from 'reactn'
import {
  Page,
  List,
  ListInput,
  Navbar,
  Block,
  Button,
} from 'framework7-react'

import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'

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
        <Navbar 
          title={i18n._(t('PasswordResetPage.reset')`Password Reset`)} 
          backLink={i18n._(t('PasswordResetPage.back')`Back`)}>
        </Navbar>
        <List form>
          <Block>Enter a new password.</Block>
          {/* TODO: Allow reveal of passwords */}
          <ListInput 
            type="password" 
            placeholder={
              i18n._(
                t('PasswordResetPage.password_placeholder')
                `Password`
              )
            }
          />
          <ListInput 
            type="password" 
            placeholder={
              i18n._(
                t('PasswordResetPage.password_confirmation')
                `Password confirmation`
              )
            }
          />
          <Block>
            <Button outline fill>
              <Trans id="PasswordResetPage.request_reset">
                Request Reset
              </Trans>
            </Button>
          </Block>
        </List>
      </Page>
    )
  }
  signIn() {
    const app = this.$f7
    const router = this.$f7router
    app.dialog.alert(
      i18n._(
        t('PasswordResetPage.will_get_email')`You should be recieving an email or text soon.`
      ), () => {
        router.back()
    })
  }
}
