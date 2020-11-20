/* eslint-disable @typescript-eslint/no-unused-expressions */
// TODO: Translate
import React from 'reactn'

import {
  Page,
  Block,
  Button,
  Navbar, BlockTitle,
} from 'framework7-react'

import { joinWords } from 'src/util'
import { User } from 'src/models/User'
import { paths } from 'src/routes'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/errors'

import { defineMessage, Trans } from '@lingui/macro'
import { completeWelcomeUser } from 'src/api'

import onlineCheckupImage from 'src/images/online-checkup.svg'

interface State {
  termsOpened: boolean
  currentUser: User
}

export default class WelcomeSurveyPage extends ReactNComponent<any, State> {
  user: User

  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.user = this.global.currentUser

    completeWelcomeUser(this.user)
  }

  render() {
    return (
      <Page>
        <Navbar
          title={this.global.i18n._(defineMessage({ id: 'WelcomeSurveyPage.title', message: 'Symptom Surveys' }))}
        />

        <BlockTitle>
          <Trans id="WelcomeSurveyPage.heading">
            Your First Symptom Check-In
          </Trans>
        </BlockTitle>
        <Block>
          <p>
            <Trans id="WelcomeSurveyPage.thank_you">
              Thanks for providing that information!
            </Trans>
          </p>

          <p>
            <Trans id="WelcomeSurvyePage.instructions">
              Greenlight helps keep your community safe by monitoring everyone's health.
              We need your help! You should fill out this survey every day especially.
            </Trans>
          </p>
          <br />
          <img src={onlineCheckupImage} alt="Daily Check-In" />

          <br />
          <br />
          <Trans id="WelcomeSurveyPage.next_screen">
            On the next screen, you'll fill out your first survey.
          </Trans>
          <br />
          <br />
          <Button href={paths.userSeqSurveysNewPath} fill>
            <Trans id="WelcomeSurveyPage.continue">Continue to Surveys</Trans>
          </Button>
        </Block>
      </Page>
    )
  }
}
