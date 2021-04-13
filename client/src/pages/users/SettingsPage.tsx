import React, { useGlobal } from 'reactn'

import { toggleLocale, signOut } from 'src/helpers/global'
import {
  f7, Page, Navbar, List, ListItem, AccordionContent, Button, Block,
} from 'framework7-react'

import { F7Props } from 'src/types'
import { deleteUser } from 'src/api'
import { assertNotNull } from 'src/helpers/util'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { dynamicPaths, paths } from 'src/config/routes'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { tr } from 'src/components/Tr'

export default function SettingsPage(props: F7Props) {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  const deleteHandler = new SubmitHandler(f7, {
    onSuccess: () => {
      signOut(props.f7router)
    },
    onSubmit: async () => {
      await deleteUser(currentUser.id)
    },
    errorTitle: tr({ en: 'Action Failed', es: 'Fallo' }),
    submittingMessage: tr({ es: 'Borrando...', en: 'Deleting...' }),
    successMessage: tr({ es: 'Acabas de borrar tu cuenta.', en: 'You just deleted your account.' }),
  })

  const handleDeleteAttempt = () => {
    f7.dialog.confirm(
      tr({
        en: 'Your account and the related information will be removed permanently. This action is irreversible. You will be automatically logged out.',
        es: 'Su cuenta y la información relacionada se eliminarán de forma permanente. Esta acción es irreversible. Se cerrará la sesión automáticamente.',
      }),
      tr({ en: 'Delete Account', es: 'Borrar Cuenta' }),
      () => {
        deleteHandler.submit()
      },
    )
  }

  return (
    <Page>
      <Navbar title={tr({ es: 'Configuración', en: 'Settings' })} sliding>
        <NavbarHomeLink slot="left" />
      </Navbar>

      <List accordionList noHairlines>
        <ListItem
          link={dynamicPaths.editUserPath({ userId: currentUser.id })}
          title={tr({ es: 'Perfil', en: 'Profile' })}
        />
        <ListItem
          link={dynamicPaths.editChildrenPath({ userId: currentUser.id })}
          title={tr({ en: 'My Children', es: 'Mis hijas' })}
        />
        {currentUser.affiliatedLocations().length > 0 && (
          <ListItem accordionItem title={tr({ es: 'Mis Ubicaciones', en: 'My Locations' })}>
            <AccordionContent>
              <List>
                {currentUser.affiliatedLocations().map((location) => (
                  <ListItem
                    title={location.name || ''}
                    link={dynamicPaths.userLocationPath({ userId: currentUser.id, locationId: location.id })}
                  />
                ))}
              </List>
            </AccordionContent>
          </ListItem>
        )}
        {/*
        {currentUser.hasChildren() && (
          <ListItem accordionItem title={t({ id: 'SettingsPage.my_children', message: 'My Children' })}>
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
        )} */}

        <ListItem
          link={paths.notificationsPath}
          title={tr({ es: 'Notificaciones', en: 'Notifications' })}
        />

        <ListItem
          link
          noChevron
          onClick={() => toggleLocale()}
          title={tr({ es: 'In English', en: 'En Español' })}
        />

        <ListItem link={paths.supportPath} title={tr({ es: 'Apoyo', en: 'Support' })} />

        <ListItem link={paths.releasesPath} title={tr({ es: 'Nuevo', en: 'Whats New' })} />

        <ListItem
          link={paths.locationLookupPath}
          title={tr({ es: 'Unir con Ubicación', en: 'Join Location' })}
        />

        <ListItem link={paths.aboutPath} title={tr({ es: 'Información', en: 'About' })} />

        <ListItem link="#" onClick={handleDeleteAttempt}>
          <Tr en="Delete Account" es="Borrar Cuenta" />
        </ListItem>
        <ListItem link onClick={() => signOut()} title={tr({ es: 'Cerrar Sesión', en: 'Sign Out' })} />
      </List>
    </Page>
  )
}
