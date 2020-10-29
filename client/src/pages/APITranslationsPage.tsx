import React from 'react'
import { Page, Navbar, Block, BlockTitle } from 'framework7-react'
import { MyTrans } from 'src/i18n'
/**
 * This page exists to enumerate translations for api errors.
 */
export default () => (
  <Page>
    <Navbar title="Not found" backLink="Back" />
    <BlockTitle>Sessions</BlockTitle>
    <Block>
      <p>
        <MyTrans id="API.sessions.invalid_email">
          No account was found for the email you provided.
        </MyTrans>
        <MyTrans id="API.sessions.invalid_phone">
          No account was found for the phone number you provided.
        </MyTrans>
        <MyTrans id="API.sessions.invalid_password">
          That password is incorrect. Please try again.
        </MyTrans>
      </p>
    </Block>

    <Block>
      <p>
        <MyTrans id="API.greenlight_status.invalid_email">
          No account was found for the email you provided.
        </MyTrans>
        <MyTrans id="API.sessions.invalid_phone">
          No account was found for the phone number you provided.
        </MyTrans>
        <MyTrans id="API.sessions.invalid_password">
          That password is incorrect. Please try again.
        </MyTrans>
      </p>
    </Block>

  </Page>
)
