import {
  Block, Button, Col, f7, List, ListInput, Navbar, Page, Row,
} from 'framework7-react'
import React, { useState } from 'react'
import { deleteLastGreenlightStatus, updateGreenlightStatus } from 'src/api'
import LoadingUserContent from 'src/components/LoadingUserContent'
import Tr, { tr } from 'src/components/Tr'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { User } from 'src/models'
import { F7Props } from 'src/types'

export default function AdminEditGreenlightPassPage(props: F7Props): JSX.Element {
  const { userId } = props.f7route.params

  assertNotUndefined(userId)

  const submitHandler = new SubmitHandler(f7, {
    onSuccess: () => {
      props.f7router.refreshPage()
    },
    successMessage: tr({ en: 'Greenlight status has been updated successfully. Refresh the page to see changes.', es: 'El estado se ha cambiado con éxito. Recargar la página para ver los cambios.' }),
    errorTitle: tr({ en: 'Something went wrong', es: 'Algo salió mal' }),
    errorMessage: tr({ en: 'Updating the last greenlight status is failed.', es: 'No se pudo cambiar el último estado.' }),
  })

  return (
    <Page>
      <LoadingUserContent
        userId={userId}
        showNavbar
        showAsPage
        content={(state) => {
          const { user } = state
          assertNotNull(user)
          const status = user.greenlightStatus()
          const [statusTitle, setStatusTitle] = useState(status.title().toLowerCase())
          const [expirationDate, setExpirationDate] = useState(status.expirationDate.toFormat('yyyy-MM-dd'))

          const handleUpdateGreenlightStatus = (status: string, expirationDate: string) => {
            submitHandler.submit(async () => {
              await updateGreenlightStatus(user, status, expirationDate)
            })
          }
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

          return (
            <>
              <Navbar title={tr({ en: 'Edit Greenlight Status', es: 'Editar Estado' })} backLink />
              <Block>
                <p>
                  <Tr
                    en="You will need to refresh the page to see any changes."
                    es="Deberá recargar la página para ver los cambios."
                  />
                </p>
              </Block>
              <List
                form
                noHairlines
                inlineLabels
                onSubmit={(e) => {
                  e.preventDefault()

                  handleUpdateGreenlightStatus(statusTitle, expirationDate)
                }}
              >
                <ListInput
                  label="Status"
                  type="select"
                  value={statusTitle}
                  onChange={(e) => setStatusTitle(e.target.value)}
                >
                  <option value="cleared">
                    <Tr en="Cleared" es="Aprobado" />
                  </option>
                  <option value="pending">
                    <Tr en="Pending" es="Pendiente" />
                  </option>
                  <option value="recovery">
                    <Tr en="Recovery" es="Recuperación" />
                  </option>
                </ListInput>
                <ListInput
                  label="Expiration Date"
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
                <Block>
                  <Row>
                    <Col>
                      <Button outline fill type="submit">
                        <Tr en="Change Status" es="Cambiar Estado" />
                      </Button>
                    </Col>
                    <Col>
                      <Button outline onClick={() => handleDeleteGreenlightStatus(user)}>
                        <Tr en="Delete Status" es="Borrar Estado" />
                      </Button>
                    </Col>
                  </Row>
                </Block>
              </List>
            </>
          )
        }}
      />
    </Page>
  )
}
