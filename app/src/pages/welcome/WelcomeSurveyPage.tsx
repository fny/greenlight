/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from "reactn"

import {
  Page,
  Block,
  Button,
  Toolbar,
  Link,
  Row,
  Col,
  Sheet,
  PageContent, Navbar, BlockTitle
} from 'framework7-react'

import { Case, When } from 'src/components/Case'

import { esExclaim, greeting, joinWords } from "src/util"
import { User } from 'src/common/models/User'
import { dynamicPaths, paths } from "src/routes"
import { ReactNComponent } from "reactn/build/components"
import { NoCurrentUserError } from "src/common/errors"

import { defineMessage, plural, Trans } from '@lingui/macro'
import { signOut } from "src/common/api"
import { myPlural, MyTrans, toggleLocale } from "src/i18n"
import { Support } from "framework7"

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

    return <Page>
        <Navbar
          title={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.survey', message: "Symptom Survey" }))}
          backLink={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.back', message: "Back" }))}>
        </Navbar>

      <BlockTitle>Your First Symptom Check-In</BlockTitle>
      <Block>
        <p>
          Thanks for reviewing that information!
        </p>

        <p>
          Greenlight helps keep your community safe by monitoring everyone's health.
          We need your help! You should fill out this survey every day especially
          when {joinWords(this.user.usersExpectedToSubmit().map(u =>
            u === this.user ? this.user.you__HACK() : u.firstName
          ), 'or')} does not feel well.
        </p>
        <br />
        <img src="/images/online-checkup.svg" alt="Daily Check-In" />


        <br /><br />
        On the next screen, you'll fill out your first survey.
        <br /><br />
        <Button href={paths.userSeqSurveysNewPath} fill>
          <MyTrans id="WelcomeSurveyPage.continue">Continue to Surveys</MyTrans>
        </Button>
      </Block>
    </Page>
  }
}
