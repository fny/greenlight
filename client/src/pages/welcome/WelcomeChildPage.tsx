import React from 'reactn'
import {
  Page, Navbar, Block, List, ListItem, ListInput, Button,
} from 'framework7-react'

import { updateUser } from 'src/api'
import { dynamicPaths, paths } from 'src/config/routes'
import { deleteBlanks } from 'src/helpers/util'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/helpers/errors'

import {
  t, Trans, plural,
} from '@lingui/macro'
import logger from 'src/helpers/logger'
import { User } from '../../models/User'
import { Case, When } from '../../components/Case'

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
    this.state = {
      physicianName: '',
      physicianPhoneNumber: '',
      needsPhysician: false,
      currentUser: this.global.currentUser,
    }
  }

  childIndex() {
    const rawId = this.$f7route.params.id
    if (!rawId) throw new Error('Child id missing')
    return parseInt(rawId, 10)
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
    const { children } = this.state.currentUser
    let names = ''
    for (let i = 0; i < children.length; i += 1) {
      names += children[i].firstName
      if (i === children.length - 2) {
        names += ', and '
      }
      if (i < children.length - 2) {
        names += ', '
      }
    }
    return names
  }

  async submit() {
    // TODO: Move delete blanks into update user
    const attrs = deleteBlanks({
      physicianName: this.state.physicianName,
      physicianPhoneNumber: this.state.physicianPhoneNumber,
      needsPhysician: this.state.needsPhysician,
    })

    this.$f7.dialog.preloader(
      t({ id: 'WelcomeChildPage.submitting_changes', message: 'Submitting changes...' }),
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
      logger.error(error)
      this.$f7.dialog.alert(
        t({ id: 'WelcomeChildPage.somethings_wrong', message: 'Something went wrong' }),
        t({ id: 'WelcomeChildPage.update_failed', message: 'Update Failed' }),
      )
    }
  }

  render() {
    const user = this.state.currentUser
    const child = this.child()

    return (
      <Page>
        <Navbar
          title={t({ id: 'WelcomeChildPage.review_child_title', message: t`Review ${child.firstName}'s Info` })}
        />

        <Case test>
          {/* First Child */}
          <When value={user.sortedChildren()[0] === child}>
            <Block>
              <Trans id="WelcomeChildPage.review_children">
                We've found {plural(user.children.length, { one: '# child', other: '# children' })}
                associated with you: {this.childrenNames()}. Let's take a moment to review their information.
              </Trans>
              <br />
            </Block>
          </When>
          {/* Last Child */}
          <When value={user.sortedChildren()[user.children.length - 1] === child}>
            <Block>
              <Trans id="WelcomeChildPage.review_child_last">
                Finally, take a moment to review {child.firstName}
                's information.
              </Trans>
            </Block>
          </When>
          <When value>
            <Block>
              <Trans id="WelcomeChildPage.review_child">
                Take a moment to review {child.firstName}
                's information.
              </Trans>
            </Block>
          </When>
        </Case>

        <List noHairlines>
          <ListItem
            footer={t({
              id: 'WelcomeChildPage.review_schools',
              message: t`Review the schools ${child.firstName} will be attending.`,
            })}
          >
            <div slot="title">
              <b>
                <Trans id="WelcomeChildPage.review_schools_title">
                  {child.firstName}
                  's Schools and Places
                </Trans>
              </b>
            </div>
          </ListItem>
          {child.locations__HACK().map((location) => (
            <ListItem key={location.id} title={location.name || ''} />
          ))}
        </List>
        <List noHairlines>
          <ListItem
            footer={t({
              id: 'WelcomeChildPage.doctor_footer',
              message: t`Who is ${child.firstName}'s primary care doctor?`,
            })}
          >
            <div slot="title">
              <b>
                <Trans id="WelcomeChildPage.doctor_title">
                  {child.firstName}
                  's Primary Care (Optional)
                </Trans>
              </b>
            </div>
          </ListItem>
          <ListItem
            checkbox
            header={t({ id: 'WelcomeChildPage.no_doctor', message: "Don't have a primary care doctor?" })}
            title={t({ id: 'WelcomeChildPage.find_doctor', message: 'Get help finding one' })}
            onChange={(e) => {
              this.setState({ needsPhysician: e.target.checked })
            }}
          />
          <ListInput
            label={t({ id: 'WelcomeChildPage.doctor_name_label', message: 'Primary Care Doctor' })}
            placeholder={t({
              id: 'WelcomeChildPage.doctor_name_placeholder',
              message: t`${child.firstName}'s doctor's name`,
            })}
            type="text"
            onInput={(e) => {
              this.setState({ physicianName: e.target.value })
            }}
          />
          <ListInput
            label={t({ id: 'WelcomeChildPage.doctor_phone_label', message: 'Primary Care Doctor Phone' })}
            placeholder={t({
              id: 'WelcomeChildPage.doctor_phone_placeholder',
              message: t`${child.firstName}'s doctor's phone`,
            })}
            type="tel"
            onInput={(e) => {
              this.setState({ physicianPhoneNumber: e.target.value })
            }}
          />
        </List>
        <Block>
          <Case test={this.hasNextChild()}>
            <When value>
              {/* TODO: FIXME DELAYED EVALUATION BUG */}
              {this.hasNextChild() && (
                <Button onClick={() => this.submit()} fill>
                  <Trans id="WelcomeChildPage.continue_to_child">Continue to {this.nextChild()?.firstName}</Trans>
                </Button>
              )}
            </When>
            <When value={false}>
              <Button fill onClick={() => this.submit()}>
                <Trans id="WelcomeChildPage.continue">Continue</Trans>
              </Button>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
