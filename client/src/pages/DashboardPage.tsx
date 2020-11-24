import React from 'reactn'
import {
  AccordionContent,
  Page,
  List,
  ListItem,
  Navbar,
  Link,
  BlockTitle,
  NavTitle,
  NavRight,
  Icon,
} from 'framework7-react'
import { esExclaim, greeting } from 'src/util'
import If from 'src/components/If'
import { dynamicPaths, paths } from 'src/routes'
import colors from 'src/misc/colors'

import { t, Trans } from '@lingui/macro'
import { User } from 'src/models'

import { ReactNComponent } from 'reactn/build/components'
import ReleaseCard from 'src/components/ReleaseCard'
import UserJDenticon from '../components/UserJDenticon'

function UserList({ users }: { users: User[] }) {
  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id} accordionItem link="#" title={user.firstName} after={user.greenlightStatus().title()}>
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
                title={t({ id: 'DashboardPage.greenlight_pass', message: 'Greenlight Pass' })}
              />
              <If test={user.hasNotSubmittedOwnSurvey()}>
                <ListItem
                  link={dynamicPaths.userSurveysNewPath(user.id, { single: true })}
                  title={t({ id: 'DashboardPage.check_in', message: 'Check In' })}
                />
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
  )
}

export default class DashboardPage extends ReactNComponent<any, any> {
  render() {
    const user = this.global.currentUser
    if (!user) {
      this.$f7router.navigate(paths.rootPath)
      return <></>
    }

    return (
      <Page>
        <Navbar>
          <NavTitle>Greenlight</NavTitle>
          <NavRight>
            <Link href={paths.settingsPath}>
              <Icon f7="person_circle" />
            </Link>
          </NavRight>
        </Navbar>

        <BlockTitle>
          <b>
            {esExclaim()}{greeting()}, {user.firstName}!
          </b>
        </BlockTitle>

        <If test={user.showSubmissionPanelForToday()}>
          <Link href={paths.userSeqSurveysNewPath}>
            <div className="GLCard">
              <div className="GLCard-title">
                <Trans id="DashboardPage.submit_check_in">Submit Daily Check-In</Trans>
              </div>
              <div className="GLCard-body" style={{ color: colors.greenDark }}>
                <Trans id="DashboardPage.needs_to_submit">
                  How are you today? You still need to check in {user.usersNotSubmittedText()}.
                </Trans>
              </div>
              <div className="GLCard-action">
                <div className="GLCard-action">
                  <div style={{ width: '80%', display: 'inline-block' }}>
                    <Trans id="DashboardPage.go_to_check_in">Go to Check-In</Trans>
                  </div>
                  <div
                    style={{
                      width: '20%',
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
          <Link href={paths.userSeqSurveysNewPath}>
            <div className="GLCard">
              <div className="GLCard-title">
                <Trans id="DashboardPage.submit_check_in">Submit Daily Check-In</Trans>
              </div>
              <div className="GLCard-body" style={{ color: colors.greenDark }}>
                <Trans id="DashboardPage.needs_to_submit_for_tomorrow">
                  Get ready for tomorrow! You need to check in {user.usersNotSubmittedForTomorrowText()}.
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

        <ReleaseCard />

        <If test={!user.hasChildren() && user.greenlightStatus().isValidForToday()}>
          <UserList users={[user]} />
        </If>

        <If test={user.hasChildren()}>
          <BlockTitle>
            {/* User is a worker and has children */}
            {user.hasLocationThatRequiresSurvey() && user.isParent() &&
              <Trans id="DashboardPage.your_family">Your Family</Trans>
            }
            {/* User is only a parent */}
            {user.isParent() && <Trans id="DashboardPage.your_children">Your Children</Trans>}
            {/* User is not a parent */}
            {!user.isParent() && <Trans id="DashboardPage.your_status">Your Status</Trans>}
          </BlockTitle>
          <UserList users={user.usersExpectedToSubmit()} />
        </If>
        <BlockTitle>
          <Trans id="DashboardPage.resources_title">Resources For You</Trans>
        </BlockTitle>
        <List>
          <ListItem
            title={t({ id: 'DashboardPage.duke_testing_title', message: 'Testing at Duke' })}
            footer={t({ id: 'DashboardPage.duke_testing_footer', message: 'Connect to streamlined testing 8am to 5pm any day' })}
            link={paths.dukeScheduleTestPath}
          >
            <Icon slot="media" f7="thermometer" />
          </ListItem>

          <ListItem
            link={paths.chwRequestPath}
            title={t({ id: 'DashboardPage.connect_to_care_title', message: 'Connect to Care' })}
            footer={t({
              id: 'DashboardPage.connect_to_care_footer',
              message: 'Send a care request to a community health worker.',
            })}
          >
            <Icon slot="media" f7="heart" />
          </ListItem>
          {/* https://www.communitycarenc.org/what-we-do/supporting-primary-care */}
          <ListItem
            external
            link="tel:1-877-490-6642"
            title={t({ id: 'DashboardPage.triage_title', message: 'Contact COVID-19 Triage' })}
            footer={t({ id: 'DashboardPage.triage_footer', message: 'Call 7am-11pm any day' })}
          >
            <Icon slot="media" f7="phone" />
          </ListItem>
          {/* <ListItem
            link={paths.ncStatewideStatsPath}
            // link="tel:1-877-490-6642"
            title={t({ id: 'DashboardPage.nc_covid_data_title', message: 'NC COVID-19 Data' })}
            footer={t({ id: 'DashboardPage.nc_covid_data_footer', message: 'COVID-19 maps and statistics from across the state' })}
          >
            <Icon slot="media" f7="graph_square" />
          </ListItem> */}
          <ListItem
            title={t({ id: 'DashboardPage.support_title', message: 'Contact Support' })}
            footer={t({ id: 'DashboardPage.support_footer', message: 'Have any questions? Message our support team.' })}
            external
            link="mailto:help@greenlightready.com"
          >
            <Icon slot="media" f7="envelope" />
          </ListItem>
          {/* https://ncchildcare.ncdhhs.gov/Portals/0/documents/pdf/P/Parent_and_Families_School_Age_Child_Care.pdf?ver=2020-08-26-122445-963 */}
          <ListItem
            external
            link="tel:1-888-600-1685"
            title={t({ id: 'DashboardPage.child_care_title', message: 'Child Care Hotline' })}
            footer={t({
              id: 'DashboardPage.child_care_footer',
              message: 'Child care referrals available 8am-5pm Monday-Friday',
            })}
          >
            <Icon slot="media" f7="phone" />
          </ListItem>
          <ListItem
            link={paths.ncTestingLocationsPath}
            title={t({ id: 'DashboardPage.testing_title', message: 'Find other Testing' })}
            footer={t({ id: 'DashboardPage.testing_footer', message: 'Testing Sites Near You' })}
          >
            <Icon slot="media" f7="search" />
          </ListItem>
        </List>
      </Page>
    )
  }
}
