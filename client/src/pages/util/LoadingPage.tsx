import { t, Trans } from '@lingui/macro'
import { Block, Navbar, Page, Preloader } from 'framework7-react'
import React, { Fragment } from 'react'
import EmailLink, { SUPPORT_EMAIL } from 'src/components/EmailLink'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import './LoadingPage.css'

export default function LoadingPage({ title }: { title?: string }): JSX.Element {
  return (
    <Fragment>
      <Navbar title={title || t({ id: 'LoadingPage.title', message: 'Loading...' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block className="LoadingPage container">
        <div className="LoadingPage item">
          <Preloader />
        </div>
      </Block>
      <Block>
        <p>
          <Trans id="LoadingPage.message">
            Stuck here for too long? Try refreshing the page. If you still need help please email us at{' '}
            <EmailLink email={SUPPORT_EMAIL} />.
          </Trans>
        </p>
      </Block>
    </Fragment>
  )
}
