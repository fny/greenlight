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
  PageContent
} from 'framework7-react'

import { Case, When } from 'src/components/Case'

import { esExclaim, greeting } from "src/util"
import { User } from 'src/common/models/User'
import { paths } from "src/routes"
import { ReactNComponent } from "reactn/build/components"
import { NoCurrentUserError } from "src/common/errors"

import { plural, Trans } from '@lingui/macro'
import { signOut } from "src/initializers/providers"
import { myPlural, MyTrans, toggleLocale } from "src/i18n"

interface State {
  termsOpened: boolean
  currentUser: User
}

export default class WelcomePage extends ReactNComponent<any, State> {
  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.state =  {
      termsOpened: false,
      currentUser: this.global.currentUser
    }
  }


  totalLocations() {
    const user = this.state.currentUser
    return user.locations__HACK().length + user.children.map(x => x.locations__HACK().length).reduce((x, y) => x + y, 0)
  }

  whoDoYouFillSurveysFor() {
    const user = this.state.currentUser
    const fillForSelf = user.locationAccounts.length > 0
    const fillForChildren = user.children.length > 0
    if (fillForSelf && fillForChildren) {
      return <MyTrans id="WelcomePage.fill_for_self_and_children">
        Every day you'll need to fill out symptom surveys for
        you and your {this.global.i18n._(myPlural('child', user.children.length))}.
      </MyTrans>
    } else if (fillForSelf) {
      return <MyTrans id="WelcomePage.fill_for_self">
        Every day you'll need to fill out symptom surveys for yourself.
      </MyTrans>
    } else if (fillForChildren) {
      return <MyTrans id="WelcomePage.fill_children">
      Every day you'll need to fill out symptom surveys for your
      {this.global.i18n._(myPlural('child', user.children.length))}.
      </MyTrans>
    } else {
      // TODO: What do we do in the case that the user is not associated with anything over the long run?
      return  <MyTrans id="WelcomePage.fill_for_no_one_error">
        It looks like your account has not been set up properly.
        Please contact greenlight at help@greenlightready.com.
      </MyTrans>
    }
  }

  render() {
    const user = this.state.currentUser
    const locationCount = this.totalLocations()
    return <Page>
      <Block>
        <h1>
          {esExclaim()}{greeting()}! &nbsp;&nbsp;&nbsp;&nbsp;
          <Link style={{fontSize: '12px'}} onClick={() => toggleLocale()}>
            <MyTrans id="WelcomePage.toggle_locale">
              En Español
            </MyTrans>
          </Link>
        </h1>


        <Case test={locationCount}>
          <When value={0}>
            <MyTrans id="WelcomePage.account_misconfigured">
              Your account hasn't been configured properly. Please contact us at help@greenlightready.com.
            </MyTrans>
          </When>
          <When>
            <p>
              <MyTrans id="WelcomePage.welcome">
                Hi {user.firstName}! You've been added
                by {this.global.i18n._(myPlural('location', this.totalLocations(), true))} to Greenlight's secure COVID-19 monitoring platform.
              </MyTrans>
            </p>
            <p>
              <MyTrans id="WelcomePage.instructions">
                {this.whoDoYouFillSurveysFor()} We will not share any data without your
                permission.
              </MyTrans>
            </p>
          </When>
        </Case>

        <img alt="Welcome to Greenlight!" src="/images/welcome-doctor.svg" />
        <p>
          <MyTrans id="WelcomePage.terms_and_conditions">
            By continuing, you accept Greenlight's <Link
              onClick={() => {
                this.setState({ termsOpened: true })
              }}
            >
              Terms and Conditions
            </Link>
            .
          </MyTrans>
        </p>
      </Block>
      <Block>
        <Row tag="p">
          <Col tag="span">
            <Button large onClick={() => signOut()}><MyTrans id="WelcomePage.sign_out">Sign Out</MyTrans></Button>
          </Col>
          <Col tag="span">
            <Button
              large
              fill
              href={paths.welcomeReviewPath}
            >
              <MyTrans id="WelcomePage.continue">Continue</MyTrans>
            </Button>
          </Col>
        </Row>
      </Block>
      <Sheet
        opened={this.state.termsOpened}
        onSheetClosed={() => {
          this.setState({ termsOpened: false })
        }}
      >
        <Toolbar>
          <div className="left"></div>
          <div className="right">
            <Link sheetClose><MyTrans id="WelcomePage.close">Close</MyTrans></Link>
          </div>
        </Toolbar>
        {/*  Scrollable sheet content */}
        <PageContent>
            {/* TODO: Host this elsewhere. */}
            <iframe src="/terms.html" style={{width: '100%', border: 0, height: '90%' }}/>
        </PageContent>
      </Sheet>
    </Page>
  }
}
