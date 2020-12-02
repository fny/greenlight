/* eslint-disable @typescript-eslint/no-unused-expressions */
// TODO: Translate
import React from 'reactn'

import {
  Page,
  Block,
  Button,
  Navbar, BlockTitle, f7,
} from 'framework7-react'

import { joinWords } from 'src/helpers/util'
import { User } from 'src/models/User'
import { paths } from 'src/config/routes'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/helpers/errors'

import { t, Trans } from '@lingui/macro'
import { completeWelcomeUser } from 'src/api'

import onlineCheckupImage from 'src/assets/images/online-checkup.svg'
import SubmissionHandler from 'src/helpers/SubmissionHandler'
import { reloadCurrentUser } from 'src/initializers/providers'

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

            {/* { FIXME: isOwnerSomewhere doesn't work
              this.user.isOwnerSomewhere() ? (
                <Trans id="WelcomeSurveyPage.thank_you_owner">
                  Congratulations on registering!
                </Trans>

              ) : (
                <Trans id="WelcomeSurveyPage.thank_you">
                  Thanks for providing that information!
                </Trans>
              )
            } */}
            <Trans id="WelcomeSurveyPage.thank_you">
              Thanks for providing that information!
            </Trans>
          </p>
          <p>
            {
            this.user.isOwnerSomewhere() ? (
              <Trans id="WelcomeSurveyPage.instructions_owner">
                Greenlight helps you keep your community safe by monitoring everyone’s safety, connecting individuals to services and information, and minimizing the risk of an outbreak at your business. We need your help to make sure we can keep your community safe! To kick things off, you and your employees should check-in every day.
              </Trans>
            ) : (
              <Trans id="WelcomeSurvyePage.instructions">
                Greenlight helps keep your community safe by monitoring everyone's health.
                We need your help! You should fill out this survey every day.
              </Trans>
            )
          }
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
          <Button
            onClick={async () => {
              new SubmissionHandler(f7).submit(async () => {
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
