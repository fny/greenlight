import { Case, When } from '../../components/Case'
import React from 'reactn'
import { Page, Navbar, Block, Link, List, ListItem, ListInput, Row, Col, Button } from 'framework7-react'

import { User } from '../../common/models/User'
import { updateUser } from 'src/common/api'
import { dynamicPaths, paths } from 'src/routes'
import { deleteBlanks } from 'src/common/util'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/common/errors'

import { DateTime } from 'luxon'
import { Trans, t, Plural, plural, defineMessage } from '@lingui/macro'
import { myPlural, MyTrans } from 'src/i18n'

interface State {
  physicianName: string
  physicianPhoneNumber: string
  needsPhysician: boolean
  currentUser: User
}

export default class extends ReactNComponent<any, State> {

  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.state =  {
      physicianName: '',
      physicianPhoneNumber: '',
      needsPhysician: false,
      currentUser: this.global.currentUser
    }
  }

  childIndex() {
    const rawId = this.$f7route.params['id']
    if (!rawId) throw new Error("Child id missing")
    return parseInt(rawId)
  }

  child(): User {
    return this.state.currentUser.sortedChildren()[this.childIndex()]
  }

  hasNextChild() {
    return this.childIndex() < this.state.currentUser.children.length - 1
  }

  nextChild() {
    if (!this.hasNextChild()) {
      return null
    }
    return this.state.currentUser.children[this.childIndex()]
  }

  childCount() {
    return this.state.currentUser.children.length
  }

  childrenNames() {
    const children = this.state.currentUser.children
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

  async submit() {
    // TODO: Move delete blanks into update user
    const attrs = deleteBlanks({
      physicianName: this.state.physicianName, physicianPhoneNumber: this.state.physicianPhoneNumber, needsPhysician: this.state.needsPhysician
    })

    this.$f7.dialog.preloader(
      this.global.i18n._(defineMessage({id: 'WelcomeChildPage.submitting_changes', message: "Submitting changes..."}))
    )
    try {
      const user = await updateUser(this.child(), attrs as Partial<User>)
      this.setGlobal({ currentUser: user })
      this.$f7.dialog.close()

      if (this.hasNextChild()) {
        this.$f7router.navigate(dynamicPaths.welcomeChildIndexPath(this.childIndex() + 1))
      } else {
        this.$f7router.navigate(paths.welcomeSurveyPath)
      }

    } catch (error) {
      this.$f7.dialog.close()
      console.error(error)
      this.$f7.dialog.alert(
        this.global.i18n._(defineMessage({id: 'WelcomeChildPage.somethings_wrong', message: "Something went wrong"})),
        this.global.i18n._(defineMessage({id: 'WelcomeChildPage.update_failed', message: "Update Failed"}))
      )
    }
  }

  render() {
    const user = this.state.currentUser
    const child = this.child()

    return (
      <Page>
        <Navbar
          title={this.global.i18n._(defineMessage({id: 'WelcomeChildPage.review_child_title', message: `Review ${child.firstName}'s Info`}))}
          backLink>
        </Navbar>

        <Case test={true}>
          {/* First Child */}
          <When value={user.sortedChildren()[0] === child}>
            <Block>
              <MyTrans id="WelcomeChildPage.review_children">
                We've found {this.global.i18n._(myPlural('child', user.children.length, true))}
                associated with you: {this.childrenNames()}. Let's take a moment
                to review their information.
              </MyTrans>
              <br />
            </Block>
          </When>
          {/* Last Child */}
          <When value={user.sortedChildren()[user.children.length - 1] === child}>
            <Block>
              <MyTrans id="WelcomeChildPage.review_child_last">
                Finally, take a moment to review {child.firstName}'s information.
              </MyTrans>
            </Block>
          </When>
          <When value={true}>
            <Block>
              <MyTrans id="WelcomeChildPage.review_child">
              Take a moment to review {child.firstName}'s information.
              </MyTrans>
            </Block>
          </When>
        </Case>

        <List noHairlines>
          <ListItem
            footer={this.global.i18n._(
              defineMessage({ id: 'WelcomeChildPage.review_schools', message: `Review the schools ${child.firstName} will be attending.` })
            )}
          >
            <div slot="title">
              <b>
                <MyTrans id="WelcomeChildPage.review_schools_title">
                  {child.firstName}'s Schools and Places
                </MyTrans>
              </b>
            </div>
          </ListItem>
          {child.locations__HACK().map((location) => (
            <ListItem
              key={location.id}
              title={location.name || ''}
              smartSelect
              smartSelectParams={{ openIn: 'sheet' }}
            >
              <select name="mac-windows" defaultValue="attending">
                <option value="in-person">
                  {this.global.i18n._(defineMessage({id: 'WelcomeChildPage.in_person', message: "In Person"}))}
                </option>
                {/* TODO */}
                {/* <option value="virtual">Virtual</option>
                <option value="mixed">Mixed</option>
                <option value="not-attending">Not Attending</option> */}
              </select>
            </ListItem>
          ))}
        </List>
        <List noHairlines>
          <ListItem
            footer={this.global.i18n._(
              defineMessage({ id: 'WelcomeChildPage.doctor_footer', message: `Who is ${child.firstName}'s primary care doctor?` })
            )}>
            <div slot="title">
              <b>
                <MyTrans id="WelcomeChildPage.doctor_title">
                  {child.firstName}'s Primary Care (Optional)
                </MyTrans>
              </b>
            </div>
          </ListItem>
          <ListItem
            checkbox
            header={this.global.i18n._(defineMessage({id: 'WelcomeChildPage.no_doctor', message: "Don't have a primary care doctor?"}))}
            title={this.global.i18n._(defineMessage({id: 'WelcomeChildPage.find_doctor', message: "Get help finding one"}))}
            onChange={e => {
              this.setState({ needsPhysician: e.target.checked })
            }}
          />
          <ListInput
            label={this.global.i18n._(defineMessage({id: 'WelcomeChildPage.doctor_name_label', message: "Primary Care Doctor"}))}
            placeholder={this.global.i18n._(defineMessage({id: 'WelcomeChildPage.doctor_name_placeholder', message: `${child.firstName}'s doctor's name`}))}
            type="text"
            onInput={e => {
              this.setState({ physicianName: e.target.value })
            }}
          />
          <ListInput
            label={this.global.i18n._(defineMessage({id: 'WelcomeChildPage.doctor_phone_label', message: "Primary Care Doctor Phone"}))}
            placeholder={this.global.i18n._(defineMessage({id: 'WelcomeChildPage.doctor_phone_placeholder', message: `${child.firstName}'s doctor's phone`}))}
            type="tel"
            onInput={e => {
              this.setState({ physicianPhoneNumber: e.target.value })
            }}
          />
        </List>
        <Block>
          <Case test={this.hasNextChild()}>
            <When value={true}>
              {/* TODO: FIXME DELAYED EVALUATION BUG */}
              {this.hasNextChild() && <Button
                onClick={() => this.submit()}
                fill
              >
                <MyTrans id="WelcomeChildPage.continue_to_child">
                  Continue to {this.nextChild()?.firstName}
                </MyTrans>
              </Button>}
            </When>
            <When value={false}>
              <Button fill onClick={() => this.submit()}>
                <MyTrans id="WelcomeChildPage.continue">
                  Continue
                </MyTrans>
              </Button>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
