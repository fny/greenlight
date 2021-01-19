import React from 'reactn'
import {
  Page, Navbar, Block, Chip,
} from 'framework7-react'
import { store } from 'src/api'
import { User } from 'src/models'

import './UserGreenlightPassPage.css'
import StatusJDenticon from 'src/components/StatusJDenticon'
import { Case, When } from 'src/components/Case'

import { t, Trans } from '@lingui/macro'
import { DateTime } from 'luxon'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es } from 'src/components/Tr'

export default class UserGreenlightPassPage extends React.Component<any, any> {
  user() {
    const { userId } = this.$f7route.params

    if (!userId) throw new Error('Missing user id')
    const user = store.findEntity<User>(`user-${userId}`)
    if (!user) throw new Error(`Could not find user for id ${userId}`)
    return user
  }

  render() {
    const user = this.user()
    const status = user.greenlightStatus()

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
          <p>
            <Case test={status.createdAt.isValid}>
              <When value>
                <Trans id="UserGreenlightPassPage.submitted">
                  Submitted at {status.createdAt.toLocaleString(DateTime.DATETIME_SHORT)}
                </Trans>

                {!status.isCleared()
                && (
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
          </p>
        </Block>
      </Page>
    )
  }
}
