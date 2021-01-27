import { useMemo, useCallback, useState } from 'reactn'
import { Page, Navbar, Block, Chip, List, ListInput, Button, f7 } from 'framework7-react'
import { store, updateGreenlightStatus } from 'src/api'
import { User } from 'src/models'

import './UserGreenlightPassPage.css'
import StatusJDenticon from 'src/components/StatusJDenticon'
import { Case, When } from 'src/components/Case'

import { t, Trans } from '@lingui/macro'
import { DateTime } from 'luxon'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es } from 'src/components/Tr'
import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import SubmitHandler from 'src/helpers/SubmitHandler'

export default function UserGreenlightPassPage(props: F7Props) {
  const { userId } = props.f7route.params

  assertNotUndefined(userId)

  const user = store.findEntity<User>(`user-${userId}`)

  assertNotNull(user)
  assertNotUndefined(user)

  const status = user.greenlightStatus()
  const [statusTitle, setStatusTitle] = useState(status.title().toLowerCase())
  const [expirationDate, setExpirationDate] = useState(status.expirationDate.toFormat('yyyy-MM-dd'))

  const submitHandler = useMemo(
    () =>
      new SubmitHandler(f7, {
        onSuccess: () => {
          props.f7router.refreshPage()
        },
        successMessage: 'Greenlight status has been updated successfully.',
        errorTitle: 'Something went wrong',
        errorMessage: 'Updating the last greenlight status is failed.',
      }),
    [],
  )

  const handleUpdateGreenlightStatus = useCallback((status: string, expirationDate: string) => {
    submitHandler.submit(async () => {
      await updateGreenlightStatus(user, status, expirationDate)
    })
  }, [])

  return (
    <Page className="UserGreenlightPassPage">
      <Navbar title={t({ id: 'UserGreenlightPassPage.pass_title', message: 'Greenlight Pass' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>

      <Block className="text-center">
        <h1>
          {user.fullName()} <Chip text={status.title().toUpperCase()} />
        </h1>
        <div id="status-icon">
          <StatusJDenticon date={DateTime.local()} status={status.status} size={250} />
        </div>
        <div>
          <Case test={status.createdAt.isValid}>
            <When value>
              <Trans id="UserGreenlightPassPage.submitted">
                Submitted at {status.createdAt.toLocaleString(DateTime.DATETIME_SHORT)}
              </Trans>

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
                  <option value="cleared">Cleared</option>
                  <option value="recovery">Recovery</option>
                </ListInput>
                <ListInput
                  label="Expiration Date"
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                />
                <Block>
                  <Button outline fill type="submit">
                    Update Last Greenlight Status
                  </Button>
                </Block>
              </List>
            </When>

            <When value={false}>
              <Trans id="UserGreenlightPassPage.not_submitted">Status has not been submitted for today.</Trans>
            </When>
          </Case>
        </div>
      </Block>
    </Page>
  )
}
