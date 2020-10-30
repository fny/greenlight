/* eslint-disable @typescript-eslint/no-unused-expressions */
// TODO: Translate
import React from 'reactn';

import {
  Page,
  Block,
  Button,
  Navbar, BlockTitle,
} from 'framework7-react';

import { joinWords } from 'src/util';
import { User } from 'src/models/User';
import { paths } from 'src/routes';
import { ReactNComponent } from 'reactn/build/components';
import { NoCurrentUserError } from 'src/errors';

import { defineMessage, Trans } from '@lingui/macro';
import { completeWelcomeUser } from 'src/api';

interface State {
  termsOpened: boolean
  currentUser: User
}

export default class WelcomeSurveyPage extends ReactNComponent<any, State> {
  user: User;

  constructor(props: any) {
    super(props);

    if (!this.global.currentUser) {
      throw new NoCurrentUserError();
    }
    this.user = this.global.currentUser;

    completeWelcomeUser(this.user);
  }

  render() {
    return (
      <Page>
        <Navbar
          title="Symptom Surveys"
          backLink={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.back', message: 'Back' }))}
        />

        <BlockTitle>Your First Symptom Check-In</BlockTitle>
        <Block>
          <p>
            Thanks for reviewing that information!
          </p>

          <p>
            Greenlight helps keep your community safe by monitoring everyone's health.
            We need your help! You should fill out this survey every day especially
            when
            {' '}
            {joinWords(this.user.usersExpectedToSubmit().map((u) => (u === this.user ? this.user.you__HACK() : u.firstName)), 'or')}
            {' '}
            does not feel well.
          </p>
          <br />
          <img src="/images/online-checkup.svg" alt="Daily Check-In" />

          <br />
          <br />
          On the next screen, you'll fill out your first survey.
          <br />
          <br />
          <Button href={paths.userSeqSurveysNewPath} fill>
            <Trans id="WelcomeSurveyPage.continue">Continue to Surveys</Trans>
          </Button>
        </Block>
      </Page>
    );
  }
}
