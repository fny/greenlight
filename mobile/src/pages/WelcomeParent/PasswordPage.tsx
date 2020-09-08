import React from 'reactn'
import { Page, Navbar, Block, List, ListInput, Button } from 'framework7-react'
import { When, Case } from '../../components/Case'



interface Props {}
interface State {}

export default class extends React.Component<Props, State> {
  render() {
    return (
      <Page>
        <Navbar title="Set Your Password"></Navbar>
        <Block>
          <p>
            You'll sign in with your email address or mobile number and this
            password.
          </p>
        </Block>
        <Block>
          <List noHairlines>
            <ListInput
              label="Password"
              type="password"
              placeholder="Password"
              required
              validate
            />
            <ListInput
              label="Confirm Password"
              type="password"
              placeholder="Password"
              required
              validate
            />
          </List>
          <img
            alt="Greenlight gives security highest importance."
            src="/images/welcome-secure.svg"
          />

          <Case test={this.global.currentUser.children.length > 0}>
            <When value={true}>
              <p>Next you'll review your children.</p>
              <Button large fill href="/welcome-parent/children/1">
                Continue
              </Button>
            </When>
            <When value={false}>
              <p>Next you'll fill out your first survey!</p>

              <Button large fill href="/welcome/users/me/surveys/new">
                Continue
              </Button>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
