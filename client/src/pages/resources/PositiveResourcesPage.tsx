import { t } from '@lingui/macro'
import {
  Block,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
  Icon,
} from 'framework7-react'
import React from 'react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import quarantineTableImage from 'src/assets/images/resources/quarantine-table.png'
import thaoImage from 'src/assets/images/people/thao.jpg'

import './PositiveResourcesPage.css'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { assertNotNull } from 'src/helpers/util'

export default function PositiveResourcesPage(): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  return (
    <Page className="PositiveResourcesPage">
      <Navbar title="Handling a Symptomatic or Positive Case">
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <div className="author-intro-byline">
          By Thao Nguyen, 4th Year Medical Student at Duke University
        </div>
        <div className="author-intro">
          <div className="author-intro-image-wrap">
            <div
              className="author-intro-image"
              style={{
                backgroundImage: `url(${thaoImage})`,
              }}
            />
          </div>
          <div className="author-intro-message">
            While a symptomatic or positive case might seem stressful, the steps are simple to follow.
          </div>
        </div>
        <List>
          {
              currentUser.isInBrevard__HACK() ? (
                <ListItem
                  title="Brevard Resources"
                  footer="Find testing sites in Brevard and Connect to the School Nurse"
                  link={paths.brevardPath}
                >
                  <Icon slot="media" f7="heart" />
                </ListItem>
              ) : (
                <ListItem
                  title={t({ id: 'DashboardPage.duke_testing_title', message: 'Testing at Duke' })}
                  footer={t({ id: 'DashboardPage.duke_testing_footer', message: 'Connect to streamlined testing 8am to 5pm any day' })}
                  link={paths.dukeScheduleTestPath}
                >
                  <Icon slot="media" f7="thermometer" />
                </ListItem>
              )
          }
          <ListItem
            link={paths.testSearchPath}
            title={t({ id: 'DashboardPage.testing_title2', message: 'Find Testing' })}
            footer={t({ id: 'DashboardPage.testing_footer2', message: 'Testing Sites Near You' })}
          >
            <Icon slot="media" f7="search" />
          </ListItem>
        </List>

        <p style={{ fontWeight: 'bold' }}>
          Has the suspected or confirmed individual been present 48 hours before symptom onset or positive test result?
        </p>

        <p>
          <span>No →</span><br />
          <ul>
            <li>Individual should undergo testing and isolate at home.</li>
            <li>No additional testing or quarantine required for other individuals.</li>
            <li>Spaces used by the individual should be <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/organizations/cleaning-disinfection.html" target="_blank">disinfected per CDC guidance.</a></li>
          </ul>
        </p>

        <p>
          <span>Yes →</span><br />
          <ul>
            <li>Individual should undergo testing and isolate at home</li>
            <li>
              Identify close contacts (defined as distance &lt;6 feet for &gt;15 minutes). For schools, be sure to include close contacts on buses and during extracurricular activities. Siblings are also considered close contacts.
            </li>
          </ul>
        </p>

        <p style={{ fontWeight: 'bold' }}>Quarantine Protocol</p>
        <p>
          Depending on whether the the individual has symptoms or has had a test,
          the quarantine protocol differs. Use the table below to determine the proper
          course of action.
        </p>
        <p>
          <img src={quarantineTableImage} alt="Protocols" width="100%" />
        </p>

      </Block>
    </Page>
  )
}
