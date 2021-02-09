import React from 'react'
import {
  Page, Navbar, Block, Chip, List, ListInput, Button, f7,
} from 'framework7-react'

import './UserGreenlightPassPage.css'
import StatusJDenticon from 'src/components/StatusJDenticon'
import { Case, When } from 'src/components/Case'

import { t, Trans } from '@lingui/macro'
import { DateTime } from 'luxon'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es, tr } from 'src/components/Tr'
import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import LoadingUserContent from 'src/components/LoadingUserContent'
import { requireCurrentUser } from 'src/helpers/global'
import { dynamicPaths } from 'src/config/routes'

export default function UserGreenlightPassPage(props: F7Props): JSX.Element {
  const { userId } = props.f7route.params
  assertNotUndefined(userId)

  const currentUser = requireCurrentUser()
  return (
    <Page className="UserGreenlightPassPage">
      <Navbar title={tr({ en: 'Greenlight Pass', es: 'Pase Greenlight' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <LoadingUserContent
        userId={userId}
        content={(state) => {
          const { user } = state
          assertNotNull(user)
          const status = user.greenlightStatus()

          return (
            <Block className="text-center">
              <h1>
                {user.fullName()} {!status.isUnknown() && <Chip text={status.title().toUpperCase()} />}
              </h1>
              <div id="status-icon">
                <StatusJDenticon date={DateTime.local()} status={status.status} size={250} />
              </div>
              <br />
              <div>
                <Case test={status.createdAt.isValid}>
                  <When value>
                    <Tr
                      en={`Submitted at ${status.createdAt.toLocaleString(DateTime.DATETIME_SHORT)}`}
                      es={`Enviado en ${status.createdAt.toLocaleString(DateTime.DATETIME_SHORT)}`}
                    />

                    {!status.isCleared() && (
                      <>
                        <br />
                        <Tr>
                          <En>
                            Anticipated return date
                            <br /> {status.expirationDate.toLocaleString(DateTime.DATE_SHORT)}
                          </En>
                          <Es>
                            Fecha de regreso anticipada
                            <br /> {status.expirationDate.toLocaleString(DateTime.DATE_SHORT)}
                          </Es>
                        </Tr>
                      </>
                    )}

                    {
                      currentUser.canAdministrate(user)
                      && (
                        <Block>
                          <Button fill href={dynamicPaths.adminEditGreenlightPassPath({ userId: user.id })}>
                            <Tr en="Edit" es="Editar" />
                          </Button>
                        </Block>
                      )
                  }
                  </When>
                  <When value={false}>

                    <Tr
                      en="Status has not been submitted for today."
                      es="No se ha enviado la encuesta para hoy."
                    />
                  </When>
                </Case>

              </div>
            </Block>
          )
        }}
      />

    </Page>
  )
}
