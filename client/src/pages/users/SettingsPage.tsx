import React, { useGlobal } from 'reactn'
import {
  f7, Page, Navbar, List, ListItem, AccordionContent, Button, Block,
} from 'framework7-react'

import { F7Props } from 'src/types'
import { toggleLocale, signOut } from 'src/initializers/providers'
import { t, Trans } from '@lingui/macro'
import { deleteUser } from 'src/api'
import { assertNotNull } from 'src/helpers/util'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { dynamicPaths, paths } from 'src/config/routes'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { User } from 'src/models'

export default function SettingsPage(props: F7Props) {
  const [currentUser] = useGlobal('currentUser') as [User, any]
  assertNotNull(currentUser)

  const deleteHandler = new SubmitHandler(f7, {
    onSuccess: () => {
      signOut(false)
    },
    onSubmit: async () => {
      await deleteUser(currentUser.id)
    },
    errorTitle: t({ id: 'Common.failed', message: 'Action Failed' }),
    submittingMessage: t({ id: 'SettingsPage.deleting_account', message: 'Deleting...' }),
    successMessage: t({ id: 'SettingsPage.delete_success', message: 'You just deleted your account.' }),
  })

  const handleDeleteAttempt = () => {
    f7.dialog.confirm(
      t({
        id: 'SettingsPage.delete_account_caution',
        message: "Your account and the related information \
        will be removed permanently. This action is irreversible. \
        You will be automatically logged out."
      }),
      t({ id: 'SettingsPage.delete_account', message: 'Delete Account' }),
      () => {
        deleteHandler.submit()
      },
    )
  }

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

      <Block>
        <Button outline color="gray" onClick={handleDeleteAttempt}>
          <Trans id="SettingsPage.delete_account">Delete Account</Trans>
        </Button>
      </Block>
    </Page>
  )
}
