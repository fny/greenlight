// TODO: I18N
// TODO: UGLY
// TODO: Add link to create account
import React, { useState, useEffect, useMemo, useGlobal } from 'reactn'
import { Page, BlockTitle, Badge, Block, Button, Link, List, ListItem, ListInput, f7, Icon } from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/helpers/util'
import { dynamicPaths, paths } from 'src/config/routes'

import './LocationPage.css'
import { Location } from 'src/models'
import { mailInvite, checkLocationRegistrationCode } from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import LoadingPageContent from 'src/components/LoadingPageContent'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import { Router } from 'framework7/modules/router/router'
import { toggleLocale } from 'src/helpers/global'
import Tr, { En, Es, tr } from 'src/components/Tr'

export default function LocationPage({ f7route, f7router }: F7Props): JSX.Element {
  const [ currentUser ] = useGlobal('currentUser')
  const { locationId } = f7route.params
  assertNotUndefined(locationId)

  return (
    <Page>
      <LoadingLocationContent
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
                  ?
                  <List>
                    <ListItem
                      title={tr({en: "Link Your Account", es: 'Conectar Su Cuenta'})}
                      footer={tr({
                        en: `Click here to link your account to ${location.name}.`,
                        es: `Haga clic aquí para conectar su cuenta a ${location.name}.`})}
                      link="#"
                    >
                      <Icon slot="media" f7="person" />
                    </ListItem>
                  </List>
                  :
                  <List>
                    <ListItem
                      title={tr({en: "Create Your Account", es: 'Crear Su Cuenta'})}
                      footer={tr({en: `Click here if ${location.name} needs you to create an account.`, es: `Haga clic aquí si ${location.name} necesita que cree una cuenta.`})}
                      link={dynamicPaths.locationLookupAccountPath({ locationId })}
                    >
                      <Icon slot="media" f7="person" />
                    </ListItem>
                    <ListItem
                      title={tr({en: "Lookup Your Account", es: 'Busqar Su Cuenta'})}
                      footer={tr({en: `Click here if ${location.name} already created an account for you.`, es: `Haga clic aquí si ${location.name} ya creó una cuenta para usted.`})}
                      link={dynamicPaths.locationRegistrationCodePath({ locationId })}
                    >
                      <Icon slot="media" f7="search" />
                    </ListItem>
                  </List>
                }

              <Link href={paths.rootPath}>Return to Home Screen</Link>
            </Block>
          )
        }}
      />
    </Page>
  )
}
