import { t } from '@lingui/macro'
import { Navbar, Page } from 'framework7-react'
import React, { useLayoutEffect, useState, useGlobal } from 'reactn'
import LoadingPageContent from 'src/components/LoadingPageContent'

import NavbarHomeLink from 'src/components/NavbarHomeLink'
import './IframeResource.css'

export default function CastlightTestSearchPage(): JSX.Element {
  const [locale] = useGlobal('locale')

  const [state, setState] = useState({ isLoaded: false })

  return (
    <Page className="IframeResource">
      {
      state.isLoaded ? (
        <Navbar
          title={t({ id: 'TestLocationsPage.title2', message: 'Find a Testing Site' })}
        >
          <NavbarHomeLink slot="left" />
        </Navbar>
      )
        : <LoadingPageContent />
    }
      {locale === 'es' && <div>No esta avaiable en español.</div>}
      <div className="iframe-wrapper">
        <iframe
          title="Lookup Test Location"
          src="https://my.castlighthealth.com/corona-virus-testing-sites/?embed=true"
          frameBorder="0"
          onLoad={() => {
            setState({ isLoaded: true })
          }}
        />

      </div>
    </Page>
  )
}
