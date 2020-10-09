import React from 'reactn'
import { AccordionContent, Page, List, ListItem, Navbar, Link, BlockTitle, NavTitle, NavRight, Icon, Actions, ActionsGroup, ActionsLabel, ActionsButton, Block } from "framework7-react"
import UserJDenticon from '../components/UserJDenticon'
import { greeting } from 'src/common/util'
import If from 'src/components/If'
import { dynamicPaths } from 'src/routes'
import colors from 'src/common/colors'

import { i18n } from 'src/i18n'
import { Trans, t } from '@lingui/macro'
import { User } from 'src/common/models'
import { GREENLIGHT_STATUSES } from 'src/common/models/GreenlightStatus'
import { signOut } from 'src/common/api'
import { Support } from 'framework7'
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
      {/* i18n._(t('DashboardPage.not_submitted')`Not Submitted`) */}
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
            title={i18n._(t('DashboardPage.greenlight_pass')`Greenlight Pass`)}
          ></ListItem>
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
          <Link href={dynamicPaths.userSurveysNewIndexPath(0)}>
            <div className="GLCard">
              <div className="GLCard-title">
                <Trans id="DashboardPage.submit_check_in">Submit Daily Check-In</Trans>
              </div>
              <div className="GLCard-body" style={{color: colors.greenDark}}>
                <Trans id="DashboardPage.needs_to_submit">
                  How are you today? You still need to fill out surveys for {user.allUsersNotSubmittedText()}.
                </Trans>
              </div>
              <div className="GLCard-action">
                <div className="GLCard-action">
                  <div style={{ width: '50%', display: 'inline-block' }}>
                  <Trans id="DashboardPage.go_to_check_in">Go to Check-In</Trans>
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
                <Trans id="DashboardPage.submit_check_in">Submit Daily Check-In</Trans>
              </div>
              <div className="GLCard-body" style={{color: colors.greenDark}}>
                <Trans id="DashboardPage.needs_to_submit_for_tomorrow">
                  Get ready for tomorrow! You need to fill out surveys for {user.allUsersNotSubmittedForTomorrowText()}.
                </Trans>
              </div>
              <div className="GLCard-action">
                <div className="GLCard-action">
                  <div style={{ width: '50%', display: 'inline-block' }}>
                  <Trans id="DashboardPage.go_to_check_in">Go to Check-In</Trans>
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
              <Trans id="DashboardPage.your_family">Your Family</Trans>
            :
              <Trans id="DashboardPage.your_children">Your Children</Trans>
          }
        </BlockTitle>
        <UserList users={[user, user.children].flat()}></UserList>
      </If>
      <BlockTitle>
        <Trans id="DashboardPage.resources_title">Resources For You</Trans>
      </BlockTitle>
      <List>
        {/* https://www.communitycarenc.org/what-we-do/supporting-primary-care */}
        <ListItem
          external={true}
          link="tel:1-877-490-6642"
          title={i18n._(t('DashboardPage.triage_title')`Contact COVID-19 Triage`)}
          footer={i18n._(t('DashboardPage.triage_footer')`Call 7AM-11PM any day`)}
        />
        <ListItem
          external={true}
          link="https://www.dcopublichealth.org/services/communicable-diseases/coronavirus-disease-2019/covid-19-testing"
          target={'_blank'}
          title={i18n._(t('DashboardPage.testing_title')`Find Testing`)}
          footer={i18n._(t('DashboardPage.testing_footer')`Testing Sites Near You`)}
        />
        {/* https://ncchildcare.ncdhhs.gov/Portals/0/documents/pdf/P/Parent_and_Families_School_Age_Child_Care.pdf?ver=2020-08-26-122445-963 */}
        <ListItem
          external={true}
          link="tel:1-888-600-1685"
          title={i18n._(t('DashboardPage.child_care_title')`Child Care Hotline`)}
          footer={i18n._(
            t('DashboardPage.child_care_footer')
            `Child care referrals for infants to age 12, available 8AM-5PM Mon-Fri`
          )}
        />
      </List>
      <Block>
      <Actions id="actions-group">
          <ActionsGroup>
            <ActionsButton onClick={() => signOut()}color="red">Sign Out</ActionsButton>
          </ActionsGroup>
        </Actions>
        </Block>
    </Page>)
  }
}
