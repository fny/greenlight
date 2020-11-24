import { t } from '@lingui/macro'
import { Navbar, Page } from 'framework7-react'
import React from 'react'

export default function NCTestLocationsPage() {
  return (
    <Page>
      <Navbar
        title={t({ id: 'TestLocationsPage.title', message: 'Find a Testing Site in NC' })}
      />
      <iframe
        src="https://my.castlighthealth.com/corona-virus-testing-sites/?embed=true&amp;guidelines=northcarolina"
        frameBorder="0"
        width="100%"
        height="1000px"
      />
    </Page>
  )
}
