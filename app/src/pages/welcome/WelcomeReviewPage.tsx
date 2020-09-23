import React from 'reactn'

import { clone } from 'lodash'
import { Page, Navbar, Block, Button, List, ListInput } from 'framework7-react'

import { User } from '../../common/models/User'

interface Props {}

interface State {
  updatedUser: User
}

export default class ReviewUserPage extends React.Component<Props, State> {
  state: State = {
    updatedUser: clone(this.global.currentUser)
  }

  render() {
    const updatedUser = this.state.updatedUser
    const isDifferentEmail = updatedUser.email !== this.global.currentUser.email
    const isDifferentMobileNumber =
      updatedUser.mobileNumber !== this.global.currentUser.mobileNumber
    return (
      <Page>
        <Navbar backLink={true} title="Review Your Info" />
        <Block>
          <p>
            Here is the information we have on file for you. Feel free to make
            any changes.
          </p>
        </Block>

        <List noHairlinesMd>
          <ListInput
            label="First Name"
            type="text"
            placeholder="Your first name"
            value={updatedUser.firstName}
            onChange={(e) => {
              updatedUser.firstName = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            required
          />
          <ListInput
            label="Last Name"
            type="text"
            placeholder="Your last name"
            value={updatedUser.lastName}
            onChange={(e) => {
              updatedUser.lastName = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            required
          />
          <ListInput
            label="Email"
            type="email"
            placeholder="Your email"
            value={updatedUser.email || ''}
            info={
              isDifferentEmail
                ? "We'll need to verify this new email."
                : undefined
            }
            onChange={(e) => {
              updatedUser.email = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            required
            validate
          />
          <ListInput
            label="Mobile number"
            type="tel"
            placeholder="Your mobile number"
            value={updatedUser.mobileNumber || ''}
            info={
              isDifferentMobileNumber
                ? "We'll need to verify this new phone number."
                : undefined
            }
            onChange={(e) => {
              updatedUser.mobileNumber = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            required
            validate
          />
          {/* TODO: Ask user if they'd prefer email or text message alerts */}
          <Block>
            <p>Next you'll set your password.</p>
            <Button href="/welcome-parent/password" fill>
              Continue
            </Button>
          </Block>
        </List>
      </Page>
    )
  }
}
