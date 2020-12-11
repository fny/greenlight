import { t } from '@lingui/macro'
import { Navbar, Page } from 'framework7-react'
import React from 'react'

export default function HelpScoutPage(): JSX.Element {
  return (
    <Page>
      <Navbar
        title={t({ id: 'HelpScoutPage.title', message: 'Contact Support' })}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        .expand {position: absolute; top: 0; left: 0; right: 0; bottom: 0; }
        .expand iframe {display: block; width: 100%; height: 100%; border: none;}
    `,
      }}
      />
      <div className="expand">
        <iframe
          title="Greenlight Support"
          src="https://greenlighted.org/app-support/"
          frameBorder="0"
          width="100%"
          height="100vh"
        />
      </div>
    </Page>
  )
}
