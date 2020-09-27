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
        <Navbar title="Greenlight Pass" backLink="Back"></Navbar>
        
        <Block className="text-center">
         <h1>{user.fullName()}   <Chip style={{backgroundColor: status.colorHex()}} text={status.status.toUpperCase()} /></h1>
        <div id="status-icon">
          <StatusJDenticon date={moment()} status={status.status} size={250} />
        </div>
        <p>
          <Case test={status.createdAt !== null}>
            <When value={true}>
              Submitted at {status.createdAt?.format('hh:mm p')}
            </When>
            <When value={false}>
              Status has not been submitted for today.
            </When> 
          </Case>
        </p>        

        </Block>
      </Page>
    )
  }
}
