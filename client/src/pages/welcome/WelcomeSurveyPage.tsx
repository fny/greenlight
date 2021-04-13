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

import { completeWelcomeUser } from 'src/api'

import welcomeSurveyImage from 'src/assets/images/illustrations/survey.png'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { reloadCurrentUser } from 'src/helpers/global'
import Tr, { En, Es, tr } from 'src/components/Tr'

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
          title={tr({ en: 'Daily Checkins', es: 'Encusta de Síntomas' })}
        />

        <BlockTitle>
          <Tr en="Your First Symptom Check-In" es="Su primera encuesta de síntomas" />
        </BlockTitle>
        <Block>
          <p>
            <Tr>
              <En>
                Greenlight helps you keep your community safe by monitoring everyone’s health, connecting individuals to services and information, and minimizing the risk of an outbreak at your business. We need your help to make sure we can keep your community safe! To kick things off, you and your employees should check-in every day.
              </En>
              <Es>
                Greenlight ayuda a mantener su comunidad segura al monitorear la salud de todos. ¡Necesitamos su ayuda! Debe completar esta encuesta todos los días.
              </Es>
            </Tr>
          </p>
          <br />
          <img src={welcomeSurveyImage} alt="Daily Check-In" width="100%" />

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
            <Tr>
              <En>Continue to Check-in</En>
              <Es>Continuar con las Encuestas</Es>
            </Tr>
          </Button>
        </Block>
      </Page>
    )
  }
}
