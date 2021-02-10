/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'reactn'

import {
  Page,
  Block,
  Button,
  Navbar, BlockTitle, f7,
} from 'framework7-react'

import { User } from 'src/models/User'
import { paths } from 'src/config/routes'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/helpers/errors'

import { t, Trans } from '@lingui/macro'
import { completeWelcomeUser } from 'src/api'

import welcomeSurveyImage from 'src/assets/images/illustrations/survey.png'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { reloadCurrentUser } from 'src/helpers/global'

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
  }

  render() {
    return (
      <Page>
        <Navbar
          title={t({ id: 'WelcomeSurveyPage.title', message: 'Daily Checkins' })}
        />

        <BlockTitle>
          <Trans id="WelcomeSurveyPage.heading">
            Your First Symptom Check-In
          </Trans>
        </BlockTitle>
        <Block>
          <p>
            {
            this.user.isOwnerSomewhere() ? (
              <Trans id="WelcomeSurveyPage.instructions_owner">
                Greenlight helps you keep your community safe by monitoring everyone’s health, connecting individuals to services and information, and minimizing the risk of an outbreak at your business. We need your help to make sure we can keep your community safe! To kick things off, you and your employees should check-in every day.
              </Trans>
            ) : (
              <Trans id="WelcomeSurvyePage.instructions">
                Greenlight helps keep your community safe by monitoring everyone's
                health and connecting everyone to services.
                We need your help! You should fill out this survey every day.
              </Trans>
            )
          }
          </p>
          <br />
          <img src={welcomeSurveyImage} alt="Daily Check-In" width="100%" />

          <br />
          <br />
          <Trans id="WelcomeSurveyPage.next_screen">
            On the next screen, you'll fill out your first survey.
          </Trans>
          <br />
          <br />
          <Button
            onClick={async () => {
              new SubmitHandler(f7).submit(async () => {
                await completeWelcomeUser(this.user)
                await reloadCurrentUser()
                this.$f7router.navigate(paths.userSeqSurveysNewPath)
              })
            }}
            fill
          >
            <Trans id="WelcomeSurveyPage.continue">Continue to Check-in</Trans>
          </Button>
        </Block>
      </Page>
    )
  }
}
