import React from 'reactn'
import { Page, Navbar, Block, Chip } from 'framework7-react'
import { stores } from 'src/common/api'
import { User } from 'src/common/models'

import './UserGreenlightPassPage.css'
import StatusJDenticon from 'src/components/StatusJDenticon'
import { Case, When } from 'src/components/Case'

import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'
import { DateTime } from 'luxon'

export default class UserGreenlightPassPage extends React.Component<any, any> {

  user() {
    const userId = this.$f7route.params['userId']

    if (!userId) throw new Error("Missing user id")
    const user = stores.recordStore.findEntity<User>(`user-${userId}`)
    if (!user) throw new Error(`Could not finder user for id ${userId}`)
    return user
  }

  render() {
    const user = this.user()
    const status = user.greenlightStatus()

    return (
      <Page className="UserGreenlightPassPage">
        <Navbar
          title={i18n._(t('UserGreenlightPassPage.pass_title')`Greenlight Pass`)}
          backLink={i18n._(t('UserGreenlightPassPage.back')`Back`)}>
        </Navbar>

        <Block className="text-center">
         <h1>{user.fullName()} <Chip text={status.title().toUpperCase()} /></h1>
          <div id="status-icon">
            <StatusJDenticon date={DateTime.local()} status={status.status} size={250} />
          </div>
          <p>
            <Case test={status.createdAt !== null}>
              <When value={true}>
                <Trans id="UserGreenlightPassPage.submitted">
                  Submitted at {status.createdAt.toLocaleString(DateTime.TIME_SIMPLE)}.
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
