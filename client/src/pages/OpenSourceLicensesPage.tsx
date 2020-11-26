import { t, Trans } from '@lingui/macro'
import licenses from 'src/data/licenses.json'
import { Block, Navbar, Page } from 'framework7-react'
import React from 'reactn'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

export default function OpenSourceLicensesPage() {
  return (
    <Page>
      <Navbar title={t({ id: 'OpenSourceLicensesPage.title', message: 'Open Source Licenses' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block strong noHairlines>
        <p>
          <Trans id="OpenSourceLicensesPage.message">
            Greenlight is built using a lot of free and open source software.
            As such, we want to give credit to all of the wonderful projects
            we use. We've tried our best to list them all below.
          </Trans>
        </p>
        <ul>
          {
            licenses.map((l) => <li>{l.name} by {l.author} under the {l.licenseType} license</li>)
          }
        </ul>
      </Block>
    </Page>
  )
}
