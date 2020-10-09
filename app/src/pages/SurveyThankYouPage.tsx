import React from 'reactn'
import { ReactNComponent } from 'reactn/build/components'
import { Page, Navbar, Block, Button } from 'framework7-react'
import { GiphyForToday } from 'src/components/Giphy'
import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'
import { NoCurrentUserError } from 'src/common/errors'
import { User } from 'src/common/models'
import { paths } from 'src/routes'


export default class SurveyThankYouPage extends ReactNComponent<any, any> {
  user: User
  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.user = this.global.currentUser
  }

  allCleared() {
    return this.user.areAllUsersCleared()
  }

  renderAllCleared() {
    return (
      <Page>
        <Navbar
          title={i18n._(t('SurveyThankYouPage.cleared_title')`All Clear!`)}
        >
        </Navbar>

        <Block>
          <p>
            <Trans id="SurveyThankYouPage.thank_you">
              Thanks for submitting your survey! Here's something we hope will make you smile. 😃
            </Trans>
          </p>
          <GiphyForToday />
          <Button large fill href={paths.dashboardPath}>
            <Trans id="SurveyThankYouPage.back_home">
              Back Home
            </Trans>
          </Button>
        </Block>
      </Page>
    )
  }

  // recovery_asymptomatic_covid_exposure
  // recovery_diagnosed_asymptomatic
  // cleared_with_symptom_improvement
  // recovery_from_diagnosis
  // pending_needs_diagnosis
  // cleared_alternative_diagnosis
  // recovery_not_covid_has_fever
  // recovery_return_tomorrow
  // cleared

  renderStatusBreakdown() {
   // TODO: This needs to be improved
   return <Page>
      <Navbar
        title="Please Take Care"
      >
      </Navbar>
      <Block>
        <p style={{fontWeight: "bold"}}>
          Not everyone was cleared.
        </p>
        <p>
          Your surveys indicates that someone should stay home and seek attention.
          For details and resources, please see your home page.
        </p>
        <Button large fill href={paths.dashboardPath}>
          <Trans id="SurveyThankYouPage.back_home">
            Back Home
          </Trans>
        </Button>
      </Block>
    </Page>
  }

  renderStatus() {
    // TODO: This needs to be improved
    return <Page>
    <Navbar
      title="Please Stay Home"
    >
    </Navbar>
    <Block>
      <p style={{fontWeight: "bold"}}>
        You haven't been cleared.
      </p>
      <p>
        Your survey indicates that you should stay home for the time being. Check out your home page to connect with services.
      </p>
      <Button large fill href={paths.dashboardPath}>
        Back Home
      </Button>
    </Block>
  </Page>
  }

  render() {
    if (this.allCleared()) {
      return this.renderAllCleared()
    }

    if (this.user.hasChildren()) {
      return this.renderStatusBreakdown()
    } else {
      return this.renderStatus()
    }

  }
}
