import React, { useGlobal } from 'reactn'
import {
  Page, Navbar, List, ListItem, AccordionContent,
} from 'framework7-react'

import { toggleLocale, signOut } from 'src/helpers/global'
import { t } from '@lingui/macro'
import { assertNotNull } from 'src/helpers/util'
import { dynamicPaths, paths } from 'src/config/routes'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

export default function SettingsPage() {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  return (
    <Page>
      <Navbar
        title={t({ id: 'SettingsPage.title', message: 'Settings' })}
        sliding
      >
        <NavbarHomeLink slot="left" />
      </Navbar>

      <List accordionList noHairlines>
        <ListItem
          link={dynamicPaths.editUserPath({ userId: currentUser.id })}
          title={t({ id: 'SettingsPage.profile', message: 'Profile' })}
        />
        {currentUser.locations__HACK().length > 0 && (
          <ListItem
            accordionItem
            title={t({ id: 'SettingsPage.my_locations', message: 'My Locations' })}
          >
            <AccordionContent>
              <List>
                {currentUser.locations__HACK().map((location) => (
                  <ListItem
                    title={location.name || ''}
                    link={dynamicPaths.userLocationPath({ userId: currentUser.id, locationId: location.id })}
                  />
                ))}
              </List>
            </AccordionContent>
          </ListItem>
        )}

        {currentUser.hasChildren() && (
          <ListItem
            accordionItem
            title={t({ id: 'SettingsPage.my_children', message: 'My Children' })}
          >
            <AccordionContent>
              <List>
                {currentUser.sortedChildren().map((child) => (
                  <ListItem
                    key={child.id}
                    link={dynamicPaths.editUserPath({ userId: child.id })}
                    title={child.firstName}
                  />
                ))}
              </List>
            </AccordionContent>
          </ListItem>
        )}

        <ListItem
          link={paths.notificationsPath}
          title={t({ id: 'SettingsPage.notifications', message: 'Notifications' })}
        />

        <ListItem
          link
          noChevron
          onClick={() => toggleLocale()}
          title={t({ id: 'Common.toggle_locale', message: 'En Español' })}
        />

        <ListItem
          link={paths.helpScoutPath}
          title={t({ id: 'SettingsPage.support', message: 'Support' })}
        />

        <ListItem
          link={paths.releasesPath}
          title={t({ id: 'SettingsPage.what_new', message: 'Whats New' })}
        />

        <ListItem
          link={paths.newUserPath}
          title={t({ id: 'SettingsPage.join_location', message: 'Join Location' })}
        />

        <ListItem
          link={paths.aboutPath}
          title={t({ id: 'SettingsPage.about', message: 'About' })}
        />

        <ListItem
          link
          onClick={() => signOut()}
          title={t({ id: 'Common.sign_out', message: 'Sign Out' })}
        />
      </List>
    </Page>
  )
}
