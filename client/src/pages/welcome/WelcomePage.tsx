/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'reactn';

import {
  Page,
  Block,
  Button,
  Toolbar,
  Link,
  Row,
  Col,
  Sheet,
  PageContent,
} from 'framework7-react';

import { Case, When } from 'src/components/Case';

import { esExclaim, greeting } from 'src/util';
import { User } from 'src/models/User';
import { paths } from 'src/routes';
import { ReactNComponent } from 'reactn/build/components';
import { NoCurrentUserError } from 'src/errors';

import { toggleLocale, signOut } from 'src/initializers/providers';
import { plural, Trans } from '@lingui/macro';

interface State {
  termsOpened: boolean
  currentUser: User
}

export default class WelcomePage extends ReactNComponent<any, State> {
  constructor(props: any) {
    super(props);

    if (!this.global.currentUser) {
      throw new NoCurrentUserError();
    }
    this.state = {
      termsOpened: false,
      currentUser: this.global.currentUser,
    };
  }

  totalLocations() {
    const user = this.state.currentUser;
    return user.locations__HACK().length + user.children.map((x) => x.locations__HACK().length).reduce((x, y) => x + y, 0);
  }

  whoDoYouFillSurveysFor() {
    const user = this.state.currentUser;
    const fillForSelf = user.locationAccounts.length > 0;
    const fillForChildren = user.children.length > 0;
    if (fillForSelf && fillForChildren) {
      return (
        <Trans id="WelcomePage.fill_for_self_and_children">
          Every day you'll need to fill out symptom surveys for
          you and your
          {' '}
          {this.global.i18n._(plural(user.children.length, { one: 'child', other: 'children' }))}
          .
        </Trans>
      );
    } if (fillForSelf) {
      return (
        <Trans id="WelcomePage.fill_for_self">
          Every day you'll need to fill out symptom surveys for yourself.
        </Trans>
      );
    } if (fillForChildren) {
      return (
        <Trans id="WelcomePage.fill_children">
          Every day you'll need to fill out symptom surveys for your
          {this.global.i18n._(plural(user.children.length, { one: 'child', other: 'children' }))}
          .
        </Trans>
      );
    }
    // TODO: What do we do in the case that the user is not associated with anything over the long run?
    return (
      <Trans id="WelcomePage.fill_for_no_one_error">
        It looks like your account has not been set up properly.
        Please contact greenlight at help@greenlightready.com.
      </Trans>
    );
  }

  render() {
    const user = this.state.currentUser;
    const locationCount = this.totalLocations();
    return (
      <Page>
        <Block>
          <h1>
            {esExclaim()}
            {greeting()}
            ! &nbsp;&nbsp;&nbsp;&nbsp;
            <Link style={{ fontSize: '12px' }} onClick={() => toggleLocale()}>
              <Trans id="WelcomePage.toggle_locale">
                En Español
              </Trans>
            </Link>
          </h1>

          <Case test={locationCount}>
            <When value={0}>
              <Trans id="WelcomePage.account_misconfigured">
                Your account hasn't been configured properly. Please contact us at help@greenlightready.com.
              </Trans>
            </When>
            <When>
              <p>
                <Trans id="WelcomePage.welcome">
                  Hi
                  {' '}
                  {user.firstName}
                  ! You've been added
                  by
                  {' '}
                  {this.global.i18n._(plural(this.totalLocations(), { one: 'location', other: 'locations' }))}
                  {' '}
                  to Greenlight's secure COVID-19 monitoring platform.
                </Trans>
              </p>
              <p>
                <Trans id="WelcomePage.instructions">
                  {this.whoDoYouFillSurveysFor()}
                  {' '}
                  We will not share any data without your
                  permission.
                </Trans>
              </p>
            </When>
          </Case>

          <img alt="Welcome to Greenlight!" src="/images/welcome-doctor.svg" />
          <p>
            <Trans id="WelcomePage.terms_and_conditions">
              By continuing, you accept Greenlight's
              {' '}
              <Link
                onClick={() => {
                  this.setState({ termsOpened: true });
                }}
              >
                Terms and Conditions
              </Link>
              .
            </Trans>
          </p>
        </Block>
        <Block>
          <Row tag="p">
            <Col tag="span">
              <Button large onClick={() => signOut()}><Trans id="WelcomePage.sign_out">Sign Out</Trans></Button>
            </Col>
            <Col tag="span">
              <Button
                large
                fill
                href={paths.welcomeReviewPath}
              >
                <Trans id="WelcomePage.continue">Continue</Trans>
              </Button>
            </Col>
          </Row>
        </Block>
        <Sheet
          opened={this.state.termsOpened}
          onSheetClosed={() => {
            this.setState({ termsOpened: false });
          }}
        >
          <Toolbar>
            <div className="left" />
            <div className="right">
              <Link sheetClose><Trans id="WelcomePage.close">Close</Trans></Link>
            </div>
          </Toolbar>
          {/*  Scrollable sheet content */}
          <PageContent>
            {/* TODO: Host this elsewhere. */}
            <iframe src="/terms.html" style={{ width: '100%', border: 0, height: '90%' }} />
          </PageContent>
        </Sheet>
      </Page>
    );
  }
}