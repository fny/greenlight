import { Case, When } from '../../components/Case'
import React from 'reactn'
import { Page, Navbar, Block, Link, List, ListItem, ListInput, Row, Col, Button } from 'framework7-react'

import { User } from '../../common/models/User'
import pluralize from 'pluralize'
import { updateUser } from 'src/common/api'
import { dynamicPaths } from 'src/routes'
import { deleteBlanks } from 'src/common/util'
import moment from 'moment'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/common/errors'

import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'

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
      physicianName: this.state.physicianName, physicianPhoneNumber: this.state.physicianPhoneNumber, needsPhysician: this.state.needsPhysician,
      completedInviteAt: moment().toISOString()
    })

    this.$f7.dialog.preloader(
      i18n._(t('WelcomeChildPage.submitting_changes')`Submitting changes...`)
    )
    try {
      const user = await updateUser(this.state.currentUser, attrs as Partial<User>)
      this.setGlobal({ currentUser: user })
      this.$f7.dialog.close()
      this.$f7router.navigate(dynamicPaths.userSurveysNewIndexPath(0))
    } catch (error) {
      this.$f7.dialog.close()
      console.error(error)
      // TODO: i18n
      this.$f7.dialog.alert(
        i18n._(t('WelcomeChildPage.somethings_wrong')`Something went wrong`),
        i18n._(t('WelcomeChildPage.update_failed')`Update Failed`)
      )
    }
  }

  render() {
    const user = this.state.currentUser
    const child = this.child()

    return (
      <Page>
        <Navbar
          title={i18n._(t('WelcomeChildPage.review_child_title')
          `Review ${child.firstName}'s Info`)}
          backLink>
        </Navbar>

        <Case test={true}>
          {/* First Child */}
          <When value={user.sortedChildren()[0] === child}>
            <Block>
              <Trans id="WelcomeChildPage.review_children">
                We've found {pluralize('child', this.childCount(), true)}{' '}
                associated with you: {this.childrenNames()}. Let's take a moment
                to review their information.
              <br />
              </Trans>
              {/* TODO: Link to a page where users can remove students. */}
              {/* <Link >Is something wrong?</Link> */}
            </Block>
          </When>
          {/* Last Child */}
          <When value={user.sortedChildren()[user.children.length - 1] === child}>
            <Block>
              <Trans id="WelcomeChildPage.review_child_last">
                Finally, take a moment to review {child.firstName}'s information.
              </Trans>
            </Block>
          </When>
          <When value={true}>
            <Block>
              <Trans id="WelcomeChildPage.review_child">
              Take a moment to review {child.firstName}'s information.
              </Trans>
            </Block>
          </When>
        </Case>

        <List noHairlines>
          <ListItem
            footer={i18n._(
              t('WelcomeChildPage.review_schools')
              `Review the schools ${child.firstName} will be attending.`)
            }
          >
            <div slot="title">
              <b>
                <Trans id="WelcomeChildPage.review_schools_title">
                  {child.firstName}'s Schools and Places
                </Trans>
              </b>
            </div>
          </ListItem>
          {child.locations_TODO().map((location) => (
            <ListItem
              title={location.name || ''}
              smartSelect
              smartSelectParams={{ openIn: 'sheet' }}
            >
              <select name="mac-windows" defaultValue="attending">
                <option value="in-person">
                  <Trans id="WelcomeChildPage.in_person">In Person</Trans>
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
            footer={i18n._(
              t('WelcomeChildPage.doctor_footer')
              `Who is ${child.firstName}'s primary care doctor?`)}>
            <div slot="title">
              <b>
                <Trans id="WelcomeChildPage.doctor_title">
                  {child.firstName}'s Primary Care (Optional)
                </Trans>
              </b>
            </div>
          </ListItem>
          <ListItem
            checkbox
            header={i18n._(t('WelcomeChildPage.no_doctor')`Don't have a primary care doctor?`)}
            title={i18n._(t('WelcomeChildPage.find_doctor')`Get help finding one`)}
            onChange={e => {
              this.setState({ needsPhysician: e.target.checked })
            }}
          />
          <ListInput
            label={i18n._(t('WelcomeChildPage.doctor_name_label')`Primary Care Doctor`)}
            placeholder={i18n._(t('WelcomeChildPage.doctor_name_placeholder')`${child.firstName}'s doctor's name`)}
            type="text"
            onInput={e => {
              this.setState({ physicianName: e.target.value })
            }}
          />
          <ListInput
            label={i18n._(t('WelcomeChildPage.doctor_phone_label')`Primary Care Doctor Phone`)}
            placeholder={i18n._(t('WelcomeChildPage.doctor_phone_placeholder')`${child.firstName}'s doctor's phone`)}
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
                href={dynamicPaths.welcomeChildIndexPath(this.childIndex() + 1)}
                fill
              >
                <Trans id="WelcomeChildPage.continue_to_child">
                  Continue to {this.nextChild()?.firstName}
                </Trans>
              </Button>}
            </When>
            <When value={false}>
              <Button fill onClick={() => this.submit()}>
                <Trans id="WelcomeChildPage.continue">
                  Continue
                </Trans>
              </Button>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
