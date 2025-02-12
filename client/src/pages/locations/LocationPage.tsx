// TODO: I18N
// TODO: UGLY
// TODO: Add link to create account
import React, { useGlobal } from 'reactn'
import {
  Page, BlockTitle, Badge, Block, Button, Link, List, ListItem, ListInput, f7, Icon,
} from 'framework7-react'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/helpers/util'
import { dynamicPaths, paths } from 'src/config/routes'

import './LocationPage.css'

import LoadingLocationContent from 'src/components/LoadingLocationContent'
import { Router } from 'framework7/modules/router/router'
import { toggleLocale } from 'src/helpers/global'
import Tr, { En, Es, tr } from 'src/components/Tr'
import EmailSupportLink from 'src/components/EmailSupportLink'

export default function LocationPage({ f7route, f7router }: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  const { locationId } = f7route.params
  assertNotUndefined(locationId)

  return (
    <Page>
      <LoadingLocationContent
        showNavbar
        showAsPage
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)
          assertNotUndefined(location)

          return (
            <Block>
              <BlockTitle medium className="title">
                <b>{location.name}</b>
                <Badge className="title-badge">{location.category}</Badge>
              </BlockTitle>
              <Link style={{ fontSize: '12px', paddingLeft: '1rem' }} onClick={() => toggleLocale()}>
                <Tr en="En Español" es="In English" />
              </Link>
              <ul>
                {location.website && (
                  <li>
                    <Tr en="Website" es="Sitio" />: <Link href={location.website}>{location.website}</Link>
                  </li>
                )}
                {location.phoneNumber && (
                  <li>
                    <Tr en="Phone" es="Teléfono" />: <Link href={`tel:${location.phoneNumber}`}>{formatPhone(location.phoneNumber)}</Link>
                  </li>
                )}
                {location.email && (
                  <li>
                    <Tr en="Email" es="Correo Electrónico" />: <Link href={`mailto:${location.email}`}>{location.email}</Link>
                  </li>
                )}
              </ul>
              <p>
                <Tr>
                  <En>
                    Greenlight provides daily symptom monitoring and additional resources for {location.name}.
                  </En>
                  <Es>
                    Greenlight ofrece encuestas diarias de síntomas y recursos adicionales para {location.name}.
                  </Es>
                </Tr>
              </p>
              <p>
                <Tr>
                  <En>
                    By registering, you permit {location.name} to have access to health statuses (cleared, pending, recovery) and COVID
                    test results you submit. You can revoke access at any time.
                  </En>
                  <Es>
                    Al registrarse, permite que {location.name} tenga acceso a los estados de salud (aprobado, pendiente, recuperación) y COVID
                    resultados de la prueba que envíe. Puedes revocar el acceso en cualquier momento.
                  </Es>
                </Tr>

              </p>
              {
                  currentUser
                    ? (
                      <List>
                        <ListItem
                          link={dynamicPaths.locationLookupPath({}, { permalink: location.permalink})}
                          title={tr({en: 'Join Location', es: 'Unite a ese Ubicación' })}
                        />
                      </List>
                    )
                    : (
                      <List>
                        <ListItem
                          title={tr({ en: 'Create Your Account', es: 'Crear Su Cuenta' })}
                          footer={tr({ en: `Click here if ${location.name} needs you to create an account.`, es: `Haga clic aquí si ${location.name} necesita que cree una cuenta.` })}
                          link={dynamicPaths.locationLookupRegistrationCodePath({ locationId })}
                        >
                          <Icon slot="media" f7="person" />
                        </ListItem>
                        <ListItem
                          title={tr({ en: 'Lookup Your Account', es: 'Buscar Su Cuenta' })}
                          footer={tr({ en: `Click here if ${location.name} already created an account for you.`, es: `Haga clic aquí si ${location.name} ya creó una cuenta para usted.` })}
                          link={dynamicPaths.locationLookupAccountPath({ locationId })}
                        >
                          <Icon slot="media" f7="search" />
                        </ListItem>
                      </List>
                    )
                }

              <Link href={paths.rootPath}>
                <Tr en="Go to Home Screen" es="Volver al Inicio" />
              </Link>
            </Block>
          )
        }}
      />
    </Page>
  )
}
