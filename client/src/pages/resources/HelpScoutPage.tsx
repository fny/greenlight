import { t } from '@lingui/macro'
import { Navbar, Page } from 'framework7-react'
import React, { useState } from 'react'

import NavbarHomeLink from 'src/components/NavbarHomeLink'
import LoadingPageContent from 'src/components/LoadingPageContent'

import './IframeResource.css'

export default function HelpScoutPage(): JSX.Element {
  const [state, setState] = useState({ isLoaded: false })
  return (
    <Page className="IframeResource">
      {
        state.isLoaded ? (
          <Navbar
            title={t({ id: 'HelpScoutPage.title', message: 'Contact Support' })}
            backLink
          />
        )
          : <LoadingPageContent />
      }
      <div className="iframe-wrapper" style={{ top: 0 }}>
        <iframe
          title="Greenlight Support"
          src="https://greenlighted.org/app-support/"
          frameBorder="0"
          onLoad={() => {
            setState({ isLoaded: true })
          }}
        />
      </div>
    </Page>
  )
}
