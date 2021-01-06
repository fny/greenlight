import { Page } from 'framework7-react'
import React from 'react'
import LoadingPageContent from 'src/components/LoadingPageContent'

export default function LoadingPage({ title }: { title?: string}): JSX.Element {
  return (
    <Page>
      <LoadingPageContent title={title} />
    </Page>
  )
}
