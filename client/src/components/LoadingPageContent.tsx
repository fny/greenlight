import { t, Trans } from '@lingui/macro'
import {
  Block, Navbar, Preloader,
} from 'framework7-react'
import React from 'react'
import EmailLink, { SUPPORT_EMAIL } from 'src/components/EmailLink'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import './LoadingPageContent.css'

export default function LoadingPageContent({ title }: { title?: string}): JSX.Element {
  return (
    <>
      <Navbar title={title || t({ id: 'LoadingPageContent.title', message: 'Loading...' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block className="LoadingPageContent container">
        <div className="LoadingPageContent loader">
          <Preloader />
        </div>
      </Block>
      <Block>
        <p>
          <Trans id="LoadingPageContent.message2">
            Stuck here for too long? If your connection is stable, try refreshing the page.
            If you still need help feel free to email support at <EmailLink email={SUPPORT_EMAIL} />.
          </Trans>
        </p>
      </Block>
    </>
  )
}
