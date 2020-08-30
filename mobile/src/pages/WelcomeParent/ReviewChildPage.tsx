import { Case, When } from '../../components/Case'
import React from 'reactn'
import { Page, Navbar, Block, Link, List, ListItem, ListInput, Row, Col, Button } from 'framework7-react'

import pluralize from 'pluralize'

interface Props {}
interface State {}

export default class extends React.Component<Props, State> {

  childId() {
    const rawId = this.$f7route.params['id']
    if (!rawId) throw new Error("Child id missing");
    return parseInt(rawId)
  }

  child() {
    return this.global.currentUser.children[this.childId() - 1]
  }

  hasNextChild() {
    return this.childId() < this.global.currentUser.children.length
  }

  nextChild() {
    if (!this.hasNextChild()) {
      return null
    }
    return this.global.currentUser.children[this.childId()]
  }

  childCount() {
    return this.global.currentUser.children.length
  }

  childrenNames() {
    const children = this.global.currentUser.children
    let names = ''
    for (let i = 0; i < children.length; i++) {
      names += children[i].firstName
      if (i === (children.length - 2)) {
        names += ', and '
      }
      if (i < children.length - 2)  {
        names += ', '
      }
    }
    return names
  }

  render() {
    const user = this.global.currentUser
    const child = this.child()

    return (
      <Page>
        <Navbar title={`Review ${child.firstName}'s Info`} backLink></Navbar>

        <Case test={true}>
          {/* First Child */}
          <When value={user.children[0] === child}>
            <Block>
              We've found {pluralize('child', this.childCount(), true)}{' '}
              associated with you: {this.childrenNames()}. Let's take a moment
              to review their information starting with {child.firstName}.
              <br />
              {/* TODO: Link to a page where users can remove students. */}
              <Link>Is something wrong?</Link>
            </Block>
          </When>
          {/* Last Child */}
          <When value={user.children[user.children.length - 1] === child}>
            <Block>Take a moment to review Bart's information.</Block>
          </When>
          <When value={true}>
            <Block>
              Finally, take a moment to review Maggie's information.
            </Block>
          </When>
        </Case>

        <List noHairlines>
          <ListItem footer="Update the schools Lisa will be attending.">
            <div slot="title">
              <b>{child.firstName}'s Schools and Places</b>
            </div>
          </ListItem>
          {child.locations.map((location) => (
            <ListItem
              title={location.name}
              smartSelect
              smartSelectParams={{ openIn: 'sheet' }}
            >
              <select name="mac-windows" defaultValue="attending">
                <option value="in-person">In Person</option>
                <option value="virtual">Virtual</option>
                <option value="mixed">Mixed</option>
                <option value="not-attending">Not Attending</option>
              </select>
            </ListItem>
          ))}
        </List>
        <List noHairlines>
          <ListItem footer="Who is Lisa's primary care doctor?">
            <div slot="title">
              <b>Lisa's Primary Care (Optional)</b>
            </div>
          </ListItem>
          <ListItem
            checkbox
            header="Don't have a primary care doctor?"
            title="Get help finding one"
            name="demo-checkbox"
          />
          <ListInput
            label="Primary Care Doctor"
            placeholder={`${child.firstName}'s doctor's name`}
            type="text"
          />
          <ListInput
            label="Primary Care Doctor Phone"
            placeholder={`${child.firstName}'s doctor's phone`}
            type="tel"
          />
        </List>
        <Block>
          <Case test={this.hasNextChild()}>
            <When value={true}>
              <Button href={`/welcome-parent/children/${this.childId() + 1}`} fill>
                Continue to {this.nextChild()?.firstName}
              </Button>
            </When>
            <When value={false}>
              <Button fill>Continue</Button>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
