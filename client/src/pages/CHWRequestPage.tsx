import { t } from '@lingui/macro'
import {
  Navbar,
  Page,
} from 'framework7-react'
import React from 'react'
import { useGlobal } from 'reactn'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

export default function CHWRequestPage() {
  const [locale] = useGlobal('locale')
  const url = locale === 'en' ? 'https://airtable.com/embed/shrIt4hurTNBrZD0g?backgroundColor=purple'
    : 'https://airtable.com/embed/shrn4S5XoOVO8S4dC?backgroundColor=purple'

  return (
    <Page>
      <Navbar title={t({ id: 'CHWRequestPage.title', message: 'Care Request' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <style dangerouslySetInnerHTML={{
        __html: `
        .expand {position: absolute; top: 40px; left: 0; right: 0; bottom: 0; }
        .expand iframe {display: block; width: 100%; height: 100%; border: none;}
    `,
      }}
      />
      <div className="expand">
        <iframe className="airtable-embed" src={url} frameBorder="0" style={{ background: 'transparent', border: '1px solid #ccc' }} />
      </div>
    </Page>
  )
}
