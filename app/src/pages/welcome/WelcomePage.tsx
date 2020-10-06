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

import pluralize from 'pluralize'
import { esExclaim, greeting } from "src/common/util"
import { User } from 'src/common/models/User'
import { paths } from "src/routes"
import { ReactNComponent } from "reactn/build/components"
import { NoCurrentUserError } from "src/common/errors"

import { Trans } from '@lingui/macro'

interface State {
  termsOpened: boolean
  currentUser: User
}

export default class WelcomeParentPage extends ReactNComponent<any, State> {
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
    return user.locations_TODO().length + user.children.map(x => x.locations_TODO().length).reduce((x, y) => x + y, 0)
  }

  whoDoYouFillSurveysFor() {
    // TODO: Rachel skipped this i18n
    const user = this.state.currentUser
    const fillForSelf = user.locations.length > 0
    const fillForChildren = user.children.length > 0
    if (fillForSelf && fillForChildren) {
      return `Every day you'll need to fill out symptom surveys for
      you and your ${pluralize('child', user.children.length)}.`
    } else if (fillForSelf) {
      return `Every day you'll need to fill out symptom surveys for yourself.`
    } else if (fillForChildren) {
      return `Every day you'll need to fill out symptom surveys for
      your ${pluralize('child', user.children.length)}.`
    } else {
      // TODO: What if they have no locations or children?
      return `This may have been due to an error. Please contact greenlight at help@greenlightready.com`
    }
  }

  render() {
    const user = this.state.currentUser
    const locationCount = this.totalLocations()
    return <Page>
      <Block>
        <h1>{esExclaim()}{greeting()}!</h1>
        <Case test={locationCount}>
          <When value={0}>
            <Trans id="WelcomePage.account_misconfigured">
              Your account hasn't been configured properly. Please contact us at help@greenlightready.com.
            </Trans>
          </When>
          <When>
            <p>
              <Trans id="WelcomePage.welcome">
                Hi {user.firstName}! You've been added by{' '}
                {pluralize('locations', this.totalLocations(), true)} to Greenlight's
                secure HIPAA and FERPA compliant COVID-19 monitoring platform.
              </Trans>
            </p>
            <p>
              <Trans id="WelcomePage.instructions">
                {this.whoDoYouFillSurveysFor()} We will not share any data without your
                permission.
              </Trans>
            </p>
          </When>
        </Case>

        <img alt="Welcome to Greenlight!" src="/images/welcome-doctor.svg" />
        <p>
          <Trans id="WelcomePage.terms_and_conditions">
            By continuing, you accept Greenlight's{' '}
            <Link
              onClick={() => {
                this.setState({ termsOpened: true })
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
            <Button large href="/"><Trans id="WelcomePage.sign_out">Sign Out</Trans></Button>
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
          this.setState({ termsOpened: false })
        }}
      >
        <Toolbar>
          <div className="left"></div>
          <div className="right">
            <Link sheetClose><Trans id="WelcomePage.close">Close</Trans></Link>
          </div>
        </Toolbar>
        {/*  Scrollable sheet content */}
        <PageContent>
          <Block>
            <p>
              {/* TODO: Terms and conditions go here. */}
            </p>
          </Block>
        </PageContent>
      </Sheet>
    </Page>
  }
}
