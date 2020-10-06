import React from 'reactn'
import { AccordionContent, Card, CardHeader, CardContent, Page, List, ListItem, Navbar, Link, Block, BlockTitle, NavLeft, NavTitle, NavRight, Icon } from "framework7-react"
import UserJDenticon from '../components/UserJDenticon'
import { greeting } from 'src/common/util'
import If from 'src/components/If'
import { dynamicPaths } from 'src/routes'
import colors from 'src/common/colors'

import pluralize from 'pluralize'

import { i18n } from 'src/i18n'
import { Trans, t } from '@lingui/macro'

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
          <div className="GLCard-title">
            <Trans id="DashboardPage.submit_check_in">Submit Daily Check-In</Trans>
            </div>
          <div className="GLCard-body" style={{color: colors.greenDark}}>
            {/* RACHEL: skipped i18n */}
            How are you today? You still need to fill out surveys for {
              user.usersNeedingSurveysText()
            }
          </div>
          <div className="GLCard-action">
            <div style={{ width: '50%', display: 'inline-block' }}>
              <Trans id="DashboardPage.go_to_check_in">Go to Check-In</Trans>
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
        </div>
        </Link>
      </If>

      <BlockTitle>
        <Trans id="DashboardPage.your_children">Your Children</Trans>
      </BlockTitle>
      <List>
        {user.children.map((child) => (
          <ListItem
            key={child.id}
            accordionItem
            link="#"
            title={child.firstName}
            after={i18n._(t('DashboardPage.not_submitted')`Not Submitted`)}
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
                  title={i18n._(t('DashboardPage.greenlight_pass')`Greenlight Pass`)}
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
          title={i18n._(t('DashboardPage.childcare_title')`Child Care Hotline`)}
          footer={i18n._(
            t('DashboardPage.childcare_footer')
            `Child care referrals for infants to age 12, available 8AM-5PM Mon-Fri`
          )}
        ><Link href="tel:1-888-600-1685" /></ListItem>

        <ListItem
          external={true}
          link="mailto:"
          title={i18n._(t('DashboardPage.more_resources_title')`More Resources`)}
          footer={i18n._(t('DashboardPage.more_resources_footer')`Additional Services to Help`)}
        ></ListItem>
      </List>
    </Page>
  )
}
