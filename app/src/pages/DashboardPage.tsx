import React, { getGlobal } from 'reactn'
import { AccordionContent, Page, List, ListItem, Navbar, Link, BlockTitle, NavTitle, NavRight, Icon, Actions, ActionsGroup, ActionsLabel, ActionsButton, Block } from "framework7-react"
import UserJDenticon from '../components/UserJDenticon'
import { greeting } from 'src/util'
import If from 'src/components/If'
import { dynamicPaths, paths } from 'src/routes'
import colors from 'src/common/colors'

import { MyTrans, toggleLocale } from 'src/i18n'
import { Trans, t, defineMessage } from '@lingui/macro'
import { User } from 'src/common/models'
import { currentUser, signOut } from 'src/common/api'
import { ReactNComponent } from 'reactn/build/components'

function UserList({ users }: { users: User[]}) {
  return <List>
  {users.map((user) => (
    <ListItem
      key={user.id}
      accordionItem
      link="#"
      title={user.firstName}
      after={
        user.greenlightStatus().title()
      }

    >
      <div slot="media">
        <UserJDenticon user={user} size={29} />
      </div>
      <AccordionContent>
        <List>
          {/* <ListItem
            link={`/users/${user.id}/covid-test`}
            title="Submit COVID Test"
          ></ListItem> */}
          <ListItem
            link={dynamicPaths.userGreenlightPassPath(user.id)}
            title={getGlobal().i18n._(defineMessage({ id: 'DashboardPage.greenlight_pass', message: "Greenlight Pass" }))}
          ></ListItem>
          <If test={user.hasNotSubmittedOwnSurvey()}>
            <ListItem
              link={dynamicPaths.userSurveysNewPath(user.id, {single: true})}
              title="Submit Symptom Survey"
            ></ListItem>
          </If>
          {/* <ListItem
            link={`/users/${user.id}/absence`}
            title="Schedule Absence"
          ></ListItem> */}
          {/* <ListItem
            link={`/users/${user.id}/locations`}
            title="Locations"
          ></ListItem> */}
        </List>
      </AccordionContent>
    </ListItem>
  ))}
</List>
}

export default class DashboardPage extends ReactNComponent<any, any> {
  render() {
    const user = this.global.currentUser
    if (!user) {
      this.$f7router.navigate('/')
      return <></>
    }

    return (
      <Page>
        <Navbar>
          <NavTitle>Greenlight</NavTitle>
          <NavRight>
            <Link actionsOpen="#actions-group">
              <Icon f7="person_circle" />
            </Link>
          </NavRight>
        </Navbar>

        <BlockTitle>
          <b>{greeting()}, {user.firstName}!</b>
        </BlockTitle>

        <If test={user.showSubmissionPanelForToday()}>
          <Link href={paths.userSeqSurveysNewPath}>
            <div className="GLCard">
              <div className="GLCard-title">
                <MyTrans id="DashboardPage.submit_check_in">Submit Daily Check-In</MyTrans>
              </div>
              <div className="GLCard-body" style={{color: colors.greenDark}}>
                <MyTrans id="DashboardPage.needs_to_submit">
                  How are you today? You still need to fill out surveys for {user.usersNotSubmittedText()}.
                </MyTrans>
              </div>
              <div className="GLCard-action">
                <div className="GLCard-action">
                  <div style={{ width: '50%', display: 'inline-block' }}>
                  <MyTrans id="DashboardPage.go_to_check_in">Go to Check-In</MyTrans>
                  </div>
                  <div
                    style={{
                      width: '50%',
                      display: 'inline-block',
                      textAlign: 'right',
                    }}
                  >
                    <Icon f7="arrow_right" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </If>

        <If test={user.showSubmissionPanelForTomorrow()}>
          <Link href={dynamicPaths.userSurveysNewIndexPath(0)}>
            <div className="GLCard">
              <div className="GLCard-title">
                <MyTrans id="DashboardPage.submit_check_in">Submit Daily Check-In</MyTrans>
              </div>
              <div className="GLCard-body" style={{color: colors.greenDark}}>
                <MyTrans id="DashboardPage.needs_to_submit_for_tomorrow">
                  Get ready for tomorrow! You need to fill out surveys for {user.usersNotSubmittedForTomorrowText()}.
                </MyTrans>
              </div>
              <div className="GLCard-action">
                <div className="GLCard-action">
                  <div style={{ width: '50%', display: 'inline-block' }}>
                  <MyTrans id="DashboardPage.go_to_check_in">Go to Check-In</MyTrans>
                  </div>
                  <div
                    style={{
                      width: '50%',
                      display: 'inline-block',
                      textAlign: 'right',
                    }}
                  >
                    <Icon f7="arrow_right" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </If>

      <If test={!user.hasChildren() && user.greenlightStatus().isValidForToday()}>
        <UserList users={[user]}></UserList>
      </If>

      <If test={user.hasChildren()}>
        <BlockTitle>
          {
            user.hasLocationThatRequiresSurvey() ?
              <MyTrans id="DashboardPage.your_family">Your Family</MyTrans>
            :
              <MyTrans id="DashboardPage.your_children">Your Children</MyTrans>
          }
        </BlockTitle>
        <UserList users={user.usersExpectedToSubmit()}></UserList>
      </If>
      <BlockTitle>
        <MyTrans id="DashboardPage.resources_title">Resources For You</MyTrans>
      </BlockTitle>
      <List>
      <ListItem
          external={true}
          link="https://www.dcopublichealth.org/services/communicable-diseases/coronavirus-disease-2019/covid-19-testing"
          target={'_blank'}
          title={this.global.i18n._(defineMessage({ id: 'DashboardPage.testing_title', message: "Find Testing" }))}
          footer={this.global.i18n._(defineMessage({ id: 'DashboardPage.testing_footer', message: "Testing Sites Near You" }))}
        >
          <Icon slot="media" f7="search" />
        </ListItem>
        {/* https://www.communitycarenc.org/what-we-do/supporting-primary-care */}
        <ListItem
          external={true}
          link="tel:1-877-490-6642"
          title={this.global.i18n._(defineMessage({ id: 'DashboardPage.triage_title', message: "Contact COVID-19 Triage" }))}
          footer={this.global.i18n._(defineMessage({ id: 'DashboardPage.triage_footer', message: "Call 7am-11pm any day" }))}
        >
          <Icon slot="media" f7="phone" />
        </ListItem>
        {/* https://ncchildcare.ncdhhs.gov/Portals/0/documents/pdf/P/Parent_and_Families_School_Age_Child_Care.pdf?ver=2020-08-26-122445-963 */}
        <ListItem
          external={true}
          link="tel:1-888-600-1685"
          title={this.global.i18n._(defineMessage({ id: 'DashboardPage.child_care_title', message: "Child Care Hotline" }))}
          footer={this.global.i18n._(
            defineMessage({id: 'DashboardPage.child_care_footer', message: "Child care referrals available 8am-5pm Monday-Friday"})
          )}
        >
          <Icon slot="media" f7="phone" />
        </ListItem>
      </List>
      <Block>
      <Actions id="actions-group">
          <ActionsGroup>
            <ActionsButton onClick={() => signOut()}color="red">
              <MyTrans>Sign Out</MyTrans>
            </ActionsButton>
            <ActionsButton onClick={() => toggleLocale() }color="blue">
              <MyTrans id="DashboardPage.toggle_locale">
                En Español
              </MyTrans>
            </ActionsButton>
            {user.isAdmin() &&
              <ActionsButton color="blue" onClick={() => { this.$f7router.navigate(dynamicPaths.adminUsersPath(user.adminLocation__HACK())) }}>
                Admin Page
              </ActionsButton>
            }
          </ActionsGroup>
        </Actions>
        </Block>
    </Page>)
  }
}
