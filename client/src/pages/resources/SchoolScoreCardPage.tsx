import { Navbar, Page } from 'framework7-react'
import React, { useState } from 'react'

import NavbarHomeLink from 'src/components/NavbarHomeLink'
import LoadingPageContent from 'src/components/LoadingPageContent'

import './IframeResource.css'

export default function SchoolScoreCardPage(): JSX.Element {
  const [state, setState] = useState({ isLoaded: false })
  return (
    <Page className="IframeResource">
      {
        state.isLoaded ? (
          <Navbar
            title="Score Card"
          >
            <NavbarHomeLink slot="left" />
          </Navbar>
        )
          : <LoadingPageContent />
      }
      <div className="iframe-wrapper">
        <iframe
          title="Score Card"
          src="https://www.surveymonkey.com/r/GreenLightScoreCard"
          frameBorder="0"
          onLoad={() => {
            setState({ isLoaded: true })
          }}
        />
      </div>
    </Page>
  )
}
