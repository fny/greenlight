import React from 'reactn'
import {
  Page, Navbar, List, ListItem,
} from 'framework7-react'

import { t } from '@lingui/macro'
import { paths } from 'src/config/routes'
import releaseData from 'src/assets/data/releases'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

const SettingsPage = () => (
  <Page>
    <Navbar title={t({ id: 'AboutPage.title', message: 'About' })}>
      <NavbarHomeLink slot="left" />
    </Navbar>
    <List noHairlines>
      <ListItem
        title={t({ id: 'AboutPage.greenlight_version', message: 'Greenlight Version' })}
        footer={releaseData[0].version}
        noChevron
      />
      <ListItem
        link="https://medium.com/greenlightready"
        title={t({ id: 'AboutPage.visit_the_blog', message: 'Visit the Blog' })}
        external
      />
      <ListItem
        link="https://greenlightready.com"
        title={t({ id: 'AboutPage.visit_our_site', message: 'Visit our Website' })}
        external
      />
      <ListItem
        link={paths.openSourcePath}
        title={t({ id: 'AboutPage.open_source_licenses', message: 'Open Source Licenses' })}
      />
      <ListItem
        link="https://docs.google.com/document/d/1kC7hXtFM2CftY7qegAEgStgw0auzM0t1BdKCoiS6uLM/?usp=sharing"
        title={t({ id: 'AboutPage.privacy_policy', message: 'Privacy Policy' })}
        external
      />
      <ListItem
        link="https://app.greenlightready.com/terms"
        title={t({ id: 'AboutPage.terms_of_service', message: 'Terms of Service' })}
        external
      />
    </List>
  </Page>
)

export default SettingsPage
