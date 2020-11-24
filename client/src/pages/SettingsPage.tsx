import React, { useGlobal } from 'reactn'
import {
  Page, Navbar, List, ListItem, AccordionContent,
} from 'framework7-react'

import { toggleLocale, signOut } from 'src/initializers/providers'
import { t } from '@lingui/macro'
import { assertNotNull } from 'src/util'
import { dynamicPaths, paths } from 'src/routes'
import { User } from 'src/models'

export default function SettingsPage() {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  return (
    <Page>
      <Navbar
        title={t({ id: 'SettingsPage.title', message: 'Settings' })}
        sliding
      />
      <List accordionList noHairlines>
        <ListItem
          link={dynamicPaths.editUserPath({ userId: currentUser.id })}
          title={t({ id: 'SettingsPage.profile', message: 'Profile' })}
        />

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
                    link={`/users/${child.id}`}
                    title={child.firstName}
                  />
                ))}
              </List>
            </AccordionContent>
          </ListItem>
        )}
        {
          currentUser.isAdminSomewhere()

        && (
        <ListItem
          accordionItem
          title="Admin"
        >
          <AccordionContent>
            <List>
              {
                currentUser.adminLocations().map((location) => (
                  <ListItem
                    key={location.id}
                    link={dynamicPaths.adminUsersPath({ locationId: location.id })}
                    title={location.name || ''}
                  />
                ))
              }
            </List>
          </AccordionContent>
        </ListItem>
        )
      }

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
          link="mailto:help@greenlightready.com"
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
