// TODO: Incomplete translation
import { Navbar, Page } from 'framework7-react'
import React, { useState, useGlobal } from 'reactn'
import LoadingPageContent from 'src/components/LoadingPageContent'

import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { tr } from 'src/components/Tr'
import './IframeResource.css'

export default function CastlightTestSearchPage(): JSX.Element {
  const [locale] = useGlobal('locale')

  const [state, setState] = useState({ isLoaded: false })

  return (
    <Page className="IframeResource">
      {
      state.isLoaded ? (
        <Navbar
          title={tr({ en: 'Find a Testing Site', es: 'Prueba de sitios cercanos' })}
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
