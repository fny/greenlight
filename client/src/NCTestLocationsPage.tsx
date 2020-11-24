import { t } from '@lingui/macro'
import { Navbar, Page } from 'framework7-react'
import React from 'react'

export default function NCTestLocationsPage() {
  return (
    <Page>
      <Navbar
        title={t({ id: 'TestLocationsPage.title', message: 'Find a Testing Site in NC' })}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        .expand {position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: red }
        .expand iframe {display: block; width: 100%; height: 100%; border: none;}
    `,
      }}
      />
      <div className="expand">
        <iframe
          src="https://my.castlighthealth.com/corona-virus-testing-sites/?embed=true&amp;guidelines=northcarolina"
          frameBorder="0"
          width="100%"
          height="100vh"
        />
      </div>
    </Page>
  )
}
