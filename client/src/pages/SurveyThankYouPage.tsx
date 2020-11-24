import React, { getGlobal } from 'reactn'
import { ReactNComponent } from 'reactn/build/components'
import {
  Page, Navbar, Block, Button, BlockTitle,
} from 'framework7-react'
import { GiphyForToday } from 'src/components/Giphy'
import { defineMessage, Trans } from '@lingui/macro'
import { NoCurrentUserError } from 'src/errors'
import { User } from 'src/models'
import { paths } from 'src/routes'
import { reasonMessage, reasonTitle } from 'src/misc/reasons'
import doctorsImage from 'src/images/doctors.svg'

export default class SurveyThankYouPage extends ReactNComponent<any, any> {
  currentUser: User

  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.currentUser = this.global.currentUser
  }

  anyMissing() {
    return this.currentUser.usersExpectedToSubmit().map((x) => x.greenlightStatus()).some((x) => x.isUnknown())
  }

  allCleared() {
    return this.currentUser.areUsersCleared()
  }

  renderAllCleared() {
    return (
      <Page>
        <Navbar
          title={this.global.i18n._(defineMessage({ id: 'SurveyThankYouPage.cleared_title', message: 'All Clear!' }))}
        />

        <Block>
          <p>
            <Trans id="SurveyThankYouPage.thank_you">
              Thanks for checking in! Here's something we hope will make you smile. 😃
            </Trans>
          </p>
          <GiphyForToday />
          <Button large fill href={paths.dashboardPath}>
            <Trans id="Common.back_home">
              Back Home
            </Trans>
          </Button>
        </Block>
      </Page>
    )
  }

  renderStatusBreakdownNotSubmitted() {
    // TODO: This needs to be improved
    return (
      <Page>
        <Navbar
          title={this.global.i18n._(defineMessage({ id: 'SurveyThankYouPage.more_to_submit_title', message: 'More to Submit' }))}
        />
        <Block>
          <p style={{ fontWeight: 'bold' }}>
            <Trans id="SurveyThankYouPage.more_to_submit_message">
              You still have more surveys to submit.
            </Trans>
          </p>
          <ul>
            {
             this.currentUser.usersExpectedToSubmit().map((u) => (
               <li key={u.id}>
                 {u.fullName()}
                 :
                 {' '}
                 {u.greenlightStatus().title()}
               </li>
             ))
           }
          </ul>
          <br />
          <p>
            <img alt="Doctors" src={doctorsImage} />
          </p>
          <Button large fill href={paths.dashboardPath}>
            <Trans id="Common.back_home">
              Back Home
            </Trans>
          </Button>
        </Block>
      </Page>
    )
  }

  renderStatusBreakdown() {
    return (
      <Page>
        <Navbar
          title={getGlobal().i18n._(defineMessage({ id: 'SurveyThankYouPage.not_all_cleared_title', message: 'Connect to Services' }))}
        />
        <Block>
          <p style={{ fontWeight: 'bold' }}>
            <Trans id="SurveyThankYouPage.not_all_cleared_heading">Not everyone was cleared.</Trans>
          </p>
          <p>
            <Trans id="SurveyThankYouPage.not_all_cleared_message">
              Your surveys indicates that someone should stay home and seek attention.
              To schedule an appointment and a test, contact the Duke triage hotline from your home screen.
            </Trans>
          </p>
          {
            this.currentUser.usersExpectedToSubmit().map((u) => (
              <>
                <p style={{ fontWeight: 'bold' }}>
                  {u.fullName()}
                  :
                  {' '}
                  {u.greenlightStatus().title()}
                </p>

                <p>{reasonMessage(u, this.currentUser)}</p>
              </>
            ))
          }
          <p>
            <img alt="Doctors" src={doctorsImage} />
          </p>
          <Button large fill href={paths.dashboardPath}>
            <Trans id="Common.back_home">
              Back Home
            </Trans>
          </Button>
        </Block>
      </Page>
    )
  }

  renderStatus() {
    const title = reasonTitle(this.currentUser, this.currentUser)
    const message = reasonMessage(this.currentUser, this.currentUser)
    // TODO: This needs to be improved
    return (
      <Page>
        <Navbar
          title={title}
        />
        <BlockTitle>
          Status:{' '}
          {this.currentUser.greenlightStatus().title()}
        </BlockTitle>
        <Block>
          <p>
            {message}
          </p>
          <br />
          <p>
            <img alt="Doctors" src={doctorsImage} />
          </p>
          <br />
          <Button large fill href={paths.dashboardPath}>
            <Trans id="Common.back_home">
              Back Home
            </Trans>
          </Button>
        </Block>
      </Page>
    )
  }

  render() {
    if (this.anyMissing()) {
      return this.renderStatusBreakdownNotSubmitted()
    }
    if (this.allCleared()) {
      return this.renderAllCleared()
    }

    if (this.currentUser.hasChildren()) {
      return this.renderStatusBreakdown()
    }
    return this.renderStatus()
  }
}
