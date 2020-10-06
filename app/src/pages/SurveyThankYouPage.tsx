import React from 'react'
import { Page, Navbar, Block, Button } from 'framework7-react'
import { GiphyForToday } from 'src/components/Giphy'
import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'


export default function SurveyThankYouPage() {
  
  
  return <Page>
    <Navbar 
      title={i18n._(t('SurveyThankYouPage.cleared_title')`All Clear!`)} 
      backLink={i18n._(t('SurveyThankYouPage.back')`Back`)}>
    </Navbar>

    <Block>
      <p style={{fontWeight: "bold"}}>
        <Trans id="SurveyThankYouPage.cleared">You are cleared!
        </Trans>
      </p>
      <p>
        <Trans id="SurveyThankYouPage.enjoy">
        Enjoy your day! Here's something we hope will make you smile. 😃
        </Trans>
      </p>
      <GiphyForToday />
      <Button large fill href="/dashboard">
        <Trans id="SurveyThankYouPage.back_home">
          Back Home
        </Trans>
      </Button>
    </Block>
  </Page>
}
