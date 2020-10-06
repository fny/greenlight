import React from 'reactn'
import { AccordionContent, Card, CardHeader, CardContent, Page, List, ListItem, Navbar, Link, Block, BlockTitle, NavLeft, NavTitle, NavRight, Icon } from "framework7-react"
import UserJDenticon from '../components/UserJDenticon'
import { greeting } from 'src/common/util'
import If from 'src/components/If'
import { dynamicPaths } from 'src/routes'
import colors from 'src/common/colors'
import pluralize from 'pluralize'

export default class DashboardPage extends React.Component<any, any> {

  render() {
    const user = this.global.currentUser
    if (!user) {
      // TODO: Flash message
      this.$f7router.navigate('/')
      return
    }
    
    
    return (
      <Page>
        <Navbar>
          <NavTitle>Greenlight</NavTitle>
          <NavRight>
            <Link>
              <Icon f7="person_circle" />
            </Link>
          </NavRight>
        </Navbar>
        <BlockTitle>
          <b>{greeting()}, {user.firstName}!</b>
        </BlockTitle>

        <If test={user.needsToSubmitSomeonesSurvey()}>
        <Link href={dynamicPaths.userSurveysNewIndexPath(0)}>
        <div className="GLCard">
          <div className="GLCard-title">Submit Daily Check-In</div>
          <div className="GLCard-body" style={{color: colors.greenDark }}>
            Get the Greenlight! You have {pluralize('survey', user.usersNeedingSurveys().length, true)} you need to fill today.
          </div>
          <div className="GLCard-action">
            <div style={{ width: '50%', display: 'inline-block' }}>
              Go to Check-In
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
        </Link>
        </If>

        <BlockTitle>Your Children</BlockTitle>
        <List>
          {user.children.map((child) => (
            <ListItem
              key={child.id}
              accordionItem
              link="#"
              title={child.firstName}
              after="Not Submitted"
            >
              <div slot="media">
                <UserJDenticon user={child} size={29} />
              </div>
              <AccordionContent>
                <List>
                  {/* <ListItem
                    link={`/users/${child.id}/covid-test`}
                    title="Submit COVID Test"
                  ></ListItem> */}
                  <ListItem
                    link={dynamicPaths.userGreenlightPassPath(child.id)}
                    title="Greenlight Pass"
                  ></ListItem>
                  {/* <ListItem
                    link={`/users/${child.id}/absence`}
                    title="Schedule Absence"
                  ></ListItem> */}
                  {/* <ListItem
                    link={`/users/${child.id}/locations`}
                    title="Locations"
                  ></ListItem> */}
                </List>
              </AccordionContent>
            </ListItem>
          ))}
        </List>
        <BlockTitle>Resources For You</BlockTitle>
        <List>
          {/* https://www.communitycarenc.org/what-we-do/supporting-primary-care */}
          <ListItem
            external={true}
            link="tel:1-877-490-6642"
            title="Contact COVID-19 Triage"
            footer="Call 7am-11pm any day"
          />
          <ListItem
            external={true}
            link="https://www.dcopublichealth.org/services/communicable-diseases/coronavirus-disease-2019/covid-19-testing"
            target={'_blank'}
            title="Find Testing"
            footer="Testing Sites Near You"
          />
          {/* https://ncchildcare.ncdhhs.gov/Portals/0/documents/pdf/P/Parent_and_Families_School_Age_Child_Care.pdf?ver=2020-08-26-122445-963 */}
          <ListItem
            external={true}
            link="tel:1-888-600-1685"
            title="Child Care Hotline"
            footer="Call 8am-5pm Monday through Friday"
          ></ListItem>
          
          <ListItem
            external={true}
            link="mailto:"
            title="More Resources"
            footer="Additional Services to Help"
          ></ListItem>
        </List>
      </Page>
    )
  }
}
