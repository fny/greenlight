import React from 'reactn'
import {
  Page,
  List,
  Navbar,
  Block,
  Button,
} from 'framework7-react'

import { Trans } from '@lingui/macro'
import EmailOrPhoneListInput from '../components/EmailOrPhoneListInput'

export default class ForgotPasswordPage extends React.Component<any, any> {
  render() {
    return (
      <Page className="ForgotPasswordPage" noToolbar noSwipeback loginScreen>
        <Navbar title="Forgot Password" backLink="Back" />
        <List form>
          <Block>
            <Trans id="ForgotPasswordPage.instructions">
              Enter your email or mobile number, and we'll send you a link to reset
              your password.
            </Trans>
          </Block>
          <li>
            <EmailOrPhoneListInput value="" />
          </li>
          <Block>
            <Button outline fill>
              Request Reset
            </Button>
          </Block>
        </List>
      </Page>
    )
  }

  signIn() {
    const app = this.$f7
    const router = this.$f7router
    app.dialog.alert('You should be recieving an email or text soon.', () => {
      router.back()
    })
  }
}
