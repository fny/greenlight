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
import SubmitHandler from 'src/helpers/SubmitHandler'
import { deleteLastGreenlightStatus } from 'src/api'
import { User } from 'src/models'

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

          const handleDeleteGreenlightStatus = (user: User) => {
            f7.dialog.confirm(
              tr({
                en: 'Do you really want to delete the status?',
                es: '¿Está seguro de que quiere borrar el estado?',
              }),
              () => {
                submitHandler.submit(async () => {
                  await deleteLastGreenlightStatus(user)
                })
              },
            )
          }

          const submitHandler = new SubmitHandler(f7, {
            onSuccess: () => {
              props.f7router.refreshPage()
            },
            successMessage: tr({ en: 'Greenlight status has been reset successfully. Refresh the page to see changes.', es: 'El estado se ha cambiado con éxito. Recargar la página para ver los cambios.' }),
            errorTitle: tr({ en: 'Something went wrong', es: 'Algo salió mal' }),
            errorMessage: tr({ en: 'Updating the last greenlight status is failed.', es: 'No se pudo cambiar el último estado.' }),
          })


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
                          <Button outline onClick={() => handleDeleteGreenlightStatus(user)}>
                            <Tr en="Reset Status" es="Borrar Estado" />
                          </Button>
                          {/* <Button fill href={dynamicPaths.adminEditGreenlightPassPath({ userId: user.id })}>
                            <Tr en="Edit" es="Editar" />
                          </Button> */}
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
