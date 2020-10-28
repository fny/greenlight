import React from 'react'
import { Page, Navbar, Block } from 'framework7-react'
import { Trans } from '@lingui/macro'
import { MyTrans } from 'src/i18n'

export default () => (
  <Page>
    <Navbar title="Not found" backLink="Back" />
    <Block strong>
      <p>
        <MyTrans id="NotFoundPage.sorry">Sorry</MyTrans>
      </p>
      <p>
        <MyTrans id="NotFoundPage.not_found">Requested content not found.</MyTrans>
      </p>
    </Block>
  </Page>
)
