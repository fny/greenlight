import React, { useGlobal, useMemo } from 'reactn'
import { Page, Navbar, List, Icon, ListItem, AccordionContent } from 'framework7-react'

import { toggleLocale, signOut } from 'src/initializers/providers'
import { defineMessage } from '@lingui/macro'

const SettingsPage = ({}) => {
  const [global] = useGlobal()
  const user = useMemo(() => global.currentUser, [global])

  return (
    <Page>
      <Navbar
        title={global.i18n._(defineMessage({ id: 'Settings.title', message: 'Settings' }))}
        backLink="Back"
        sliding
      />
      <List accordionList>
        <ListItem
          link={`/users/${user?.id}/edit`}
          title={global.i18n._(defineMessage({ id: 'Settings.account', message: 'Account' }))}
        ></ListItem>

        {user?.isAdmin() && (
          <ListItem accordionItem title={global.i18n._(defineMessage({ id: 'Settings.admin', message: 'Admin' }))}>
            <AccordionContent>
              <List>
                <ListItem
                  link="/admin/plumbing"
                  title={global.i18n._(defineMessage({ id: 'Settings.ACMEPlumbing', message: 'ACME Plumbing' }))}
                ></ListItem>
              </List>
            </AccordionContent>
          </ListItem>
        )}

        {user?.hasChildren() && (
          <ListItem
            accordionItem
            title={global.i18n._(defineMessage({ id: 'Settings.my_children', message: 'My Children' }))}
          >
            <AccordionContent>
              <List>
                {user?.sortedChildren().map((child) => (
                  <ListItem
                    key={child.id}
                    link={`/users/${user?.id}/children/${child.id}`}
                    title={child.firstName}
                  ></ListItem>
                ))}
              </List>
            </AccordionContent>
          </ListItem>
        )}

        <ListItem
          accordionItem
          title={global.i18n._(defineMessage({ id: 'Settings.my_locations', message: 'My Locations' }))}
        >
          <AccordionContent>
            <List>
              <ListItem
                link="#"
                title={global.i18n._(defineMessage({ id: 'Settings.ACMEPlumbing', message: 'ACME Plumbing' }))}
              ></ListItem>
              <ListItem
                link="#"
                title={global.i18n._(
                  defineMessage({ id: 'Settings.Lambda_high_school', message: 'Lambda High School(Bob)' }),
                )}
              ></ListItem>
              <ListItem
                link="#"
                title={global.i18n._(
                  defineMessage({ id: 'Settings.divinity_middle', message: 'Divinity Middle(Mary)' }),
                )}
              ></ListItem>
            </List>
          </AccordionContent>
        </ListItem>

        <ListItem
          link="/settings/reminders"
          title={global.i18n._(defineMessage({ id: 'Settings.reminders', message: 'Reminders' }))}
        ></ListItem>

        <ListItem
          link="/settings/password"
          title={global.i18n._(defineMessage({ id: 'Settings.password', message: 'Password' }))}
        ></ListItem>

        <ListItem
          onClick={() => toggleLocale()}
          title={global.i18n._(defineMessage({ id: 'Settings.toggle_locale', message: 'En Español' }))}
        ></ListItem>

        <ListItem
          link="lucy@greenlightready.com"
          title={global.i18n._(defineMessage({ id: 'Settings.support', message: 'Support' }))}
        ></ListItem>

        <ListItem
          link="/releases"
          title={global.i18n._(defineMessage({ id: 'Settings.what_new', message: 'Whats New' }))}
        ></ListItem>

        <ListItem
          link="/about"
          title={global.i18n._(defineMessage({ id: 'Settings.about', message: 'About' }))}
        ></ListItem>

        <ListItem
          onClick={() => signOut()}
          title={global.i18n._(defineMessage({ id: 'Settings.sign_out', message: 'Sign Out' }))}
        ></ListItem>
      </List>
    </Page>
  )
}

export default SettingsPage
