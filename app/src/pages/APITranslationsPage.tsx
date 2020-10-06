import React from 'react'
import { Page, Navbar, Block, BlockTitle } from 'framework7-react'
import { Trans } from '@lingui/macro'
/**
 * This page exists to enumerate translations for api errors.
 */
export default () => (
  <Page>
    <Navbar title="Not found" backLink="Back" />
    <BlockTitle>Sessions</BlockTitle>
    <Block>
      <p>
        <Trans id="API.sessions.invalid_email">
          No account was found for the email you provided.
        </Trans>
        <Trans id="API.sessions.invalid_phone">
          No account was found for the phone number you provided.
        </Trans>
        <Trans id="API.sessions.invalid_password">
          That password is incorrect. Please try again.
        </Trans>
      </p>
    </Block>

      <Block>
      <p>
        <Trans id="API.sessions.invalid_email">
          No account was found for the email you provided.
        </Trans>
        <Trans id="API.sessions.invalid_phone">
          No account was found for the phone number you provided.
        </Trans>
        <Trans id="API.sessions.invalid_password">
          That password is incorrect. Please try again.
        </Trans>
      </p>
    </Block>
    
  </Page>
)
