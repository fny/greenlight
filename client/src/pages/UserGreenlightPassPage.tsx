import React from 'reactn'
import {
  Page, Navbar, Block, Chip,
} from 'framework7-react'
import { store } from 'src/api'
import { User } from 'src/models'

import './UserGreenlightPassPage.css'
import StatusJDenticon from 'src/components/StatusJDenticon'
import { Case, When } from 'src/components/Case'

import { defineMessage, Trans } from '@lingui/macro'
import { DateTime } from 'luxon'

export default class UserGreenlightPassPage extends React.Component<any, any> {
  user() {
    const { userId } = this.$f7route.params

    if (!userId) throw new Error('Missing user id')
    const user = store.findEntity<User>(`user-${userId}`)
    if (!user) throw new Error(`Could not finder user for id ${userId}`)
    return user
  }

  render() {
    const user = this.user()
    const status = user.greenlightStatus()

    return (
      <Page className="UserGreenlightPassPage">
        <Navbar
          title={this.global.i18n._(defineMessage({ id: 'UserGreenlightPassPage.pass_title', message: 'Greenlight Pass' }))}
          backLink={this.global.i18n._(defineMessage({ id: 'UserGreenlightPassPage.back', message: 'Back' }))}
        />

        <Block className="text-center">
          <h1>
            {user.fullName()}
            {' '}
            <Chip text={status.title().toUpperCase()} />
          </h1>
          <div id="status-icon">
            <StatusJDenticon date={DateTime.local()} status={status.status} size={250} />
          </div>
          <p>
            <Case test={status.createdAt.isValid}>
              <When value>
                <Trans id="UserGreenlightPassPage.submitted">
                  Submitted at
                  {' '}
                  {status.createdAt.toLocaleString(DateTime.DATETIME_SHORT)}
                  .
                </Trans>
              </When>
              <When value={false}>
                <Trans id="UserGreenlightPassPage.not_submitted">
                  Status has not been submitted for today.
                </Trans>
              </When>
            </Case>
          </p>
        </Block>
      </Page>
    )
  }
}
