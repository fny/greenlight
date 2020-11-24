import {
  Page,
} from 'framework7-react'
import React from 'react'
import { useGlobal } from 'reactn'

export default function CHWRequestPage() {
  const [locale] = useGlobal('locale')
  const url = locale === 'en' ? 'https://airtable.com/embed/shrIt4hurTNBrZD0g?backgroundColor=purple'
    : 'https://airtable.com/embed/shrn4S5XoOVO8S4dC?backgroundColor=purple'

  return (
    <Page>
      <iframe className="airtable-embed" src={url} frameBorder="0" width="100%" height="100%" style={{ background: 'transparent', border: '1px solid #ccc' }} />
    </Page>
  )
}
