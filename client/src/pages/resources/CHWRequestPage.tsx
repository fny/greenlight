import { t } from '@lingui/macro'
import {
  Navbar,
  Page,
} from 'framework7-react'
import React from 'react'
import { useGlobal, useState } from 'reactn'
import LoadingPageContent from 'src/components/LoadingPageContent'

import NavbarHomeLink from 'src/components/NavbarHomeLink'

import './IframeResource.css'

export default function CHWRequestPage() {
  const spanishURL = 'https://airtable.com/embed/shrn4S5XoOVO8S4dC'
  const englishURL = 'https://airtable.com/embed/shrIt4hurTNBrZD0g'

  const [locale] = useGlobal('locale')
  const url = locale === 'en' ? englishURL : spanishURL
  const [state, setState] = useState({ isLoaded: false })

  return (
    <Page className="IframeResource">
      {
        state.isLoaded ? (
          <Navbar title={t({ id: 'CHWRequestPage.title2', message: 'Services Request' })}>
            <NavbarHomeLink slot="left" />
          </Navbar>
        )
          : <LoadingPageContent />
      }

      <div className="iframe-wrapper">
        <iframe
          title="Service Request"
          src={url}
          id="chw-frame"
          frameBorder="0"
          onLoad={() => {
            setState({ isLoaded: true })
          }}
        />
      </div>
    </Page>
  )
}
