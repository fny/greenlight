import React from 'reactn'
import { Page, Navbar, Block, Button, Chip } from 'framework7-react'
import { currentUser, stores } from 'src/common/api'
import { User } from 'src/common/models'

import './UserGreenlightPassPage.css'
import JDenticon from 'src/components/StatusJDenticon'
import StatusJDenticon from 'src/components/StatusJDenticon'
import moment from 'moment'
import { Case, When } from 'src/components/Case'
import { GREENLIGHT_COLORS } from 'src/common/models/GreenlightStatus'
import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'

export default class UserGreenlightPassPage extends React.Component<any, any> {
  
  user() {
    const userId = this.$f7route.params['id']
    if (!userId) throw new Error("Missing id")
    const user = stores.recordStore.findEntity<User>(userId)
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
          {/* TODO: figure out how to translate the pass status when it's evaluated */}
         <h1>{user.fullName()}   <Chip style={{backgroundColor: status.colorHex()}} text={status.status.toUpperCase()} /></h1>
        <div id="status-icon">
          <StatusJDenticon date={moment()} status={status.status} size={250} />
        </div>
        <p>
          <Case test={status.createdAt !== null}>
            <When value={true}>
              <Trans id="UserGreenlightPassPage.submitted">
                Submitted at {status.createdAt?.format('hh:mm p')}
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
