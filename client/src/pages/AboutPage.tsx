import React, { useGlobal, useMemo } from 'reactn'
import { Page, Navbar, List, Icon, ListItem, AccordionContent } from 'framework7-react'

import { toggleLocale, signOut } from 'src/initializers/providers'
import { defineMessage } from '@lingui/macro'

const SettingsPage = ({}) => {
  const [global] = useGlobal()
  const user = useMemo(() => global.currentUser, [global])

  return (
    <Page>
      <Navbar title={global.i18n._(defineMessage({ id: 'About.title', message: 'About' }))} backLink="Back" sliding />
      <List accordionList>
        <ListItem
          link="#"
          title={global.i18n._(defineMessage({ id: 'About.greenlight_version', message: 'GreenLight Version' }))}
        ></ListItem>
        <ListItem
          link="#"
          title={global.i18n._(defineMessage({ id: 'About.visit_the_blog', message: 'Visit the Blog' }))}
        ></ListItem>
        <ListItem
          external
          link="https://greenlightready.com"
          title={global.i18n._(
            defineMessage({ id: 'About.visit_greenlightready_com', message: 'Visit greenlightready.com' }),
          )}
          target="_blank"
        ></ListItem>
        <ListItem
          external
          link="https://greenlighted.org"
          title={global.i18n._(
            defineMessage({ id: 'About.visit_greenlighted_org', message: 'Visit greenlighted.org' }),
          )}
          target="_blank"
        ></ListItem>
        <ListItem
          link="#"
          title={global.i18n._(defineMessage({ id: 'About.open_source_licenses', message: 'Open source licenses' }))}
        ></ListItem>
        <ListItem
          link="#"
          title={global.i18n._(defineMessage({ id: 'About.privacy_policy', message: 'Privacy Policy' }))}
        ></ListItem>
        <ListItem
          link="#"
          title={global.i18n._(defineMessage({ id: 'About.Cookie Policy', message: 'Cookie Policy' }))}
        ></ListItem>
        <ListItem
          link="#"
          title={global.i18n._(defineMessage({ id: 'About.terms_of_service', message: 'Terms of Service' }))}
        ></ListItem>
      </List>
    </Page>
  )
}

export default SettingsPage
