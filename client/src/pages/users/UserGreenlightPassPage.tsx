
import { useMemo, useCallback, useState, useGlobal, PureComponentClass } from 'reactn'
import { Page, Navbar, Block, Chip, List, ListInput, Button, f7 } from 'framework7-react'
import { store, updateGreenlightStatus } from 'src/api'
import { CurrentUser, User } from 'src/models'

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
import LoadingContent, { LoadingState } from 'src/components/LoadingContent'
import LoadingUserContent from 'src/components/LoadingUserContent'

export default function UserGreenlightPassPage(props: F7Props) {
  const userId = props.f7route.params.userId
  const [currentUser] = useGlobal('currentUser')
  assertNotUndefined(userId)
  return (
    <Page className="UserGreenlightPassPage">
      <Navbar title={t({ id: 'UserGreenlightPassPage.pass_title', message: 'Greenlight Pass' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <LoadingUserContent
        userId={userId}
        content={(state) => {
          const user = state.user
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
                  </When>
                  <When value={false}>
                    <Trans id="UserGreenlightPassPage.not_submitted">Status has not been submitted for today.</Trans>
                  </When>
                </Case>

                {/* {currentUser?.isOwnerOf(user) &&



                } */}
              </div>
            </Block>
          )
        }}
      />

    </Page>
  )
}
