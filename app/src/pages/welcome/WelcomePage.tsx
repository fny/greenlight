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
import { timeOfDay } from "src/common/util"
import { User } from 'src/common/models/User'
import { paths } from "src/routes"
import { ReactNComponent } from "reactn/build/components"
import { NoCurrentUserError } from "src/common/errors"


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
        <h1>
          <Case test={timeOfDay()}>
            <When value="morning">Good Morning!</When>
            <When value="afternoon">Good Afternoon!</When>
            <When value="evening">Good Evening!</When>
          </Case>
        </h1>
        <Case test={locationCount}>
          <When value={0}>
            Your account hasn't been configured properly. Please contact us at help@greenlightready.com.
          </When>
          <When>
            <p>
              Hi {user.firstName}! You've been added by{' '}
              {pluralize('locations', this.totalLocations(), true)} to Greenlight's
              secure HIPAA and FERPA compliant COVID-19 monitoring platform.
            </p>
            <p>
              {this.whoDoYouFillSurveysFor()} We will not share any data without your
              permission.
            </p>
          </When>
        </Case>

        <img alt="Welcome to Greenlight!" src="/images/welcome-doctor.svg" />
        <p>
          By continuing, you accept Greenlight's{' '}
          <Link
            onClick={() => {
              this.setState({ termsOpened: true })
            }}
          >
            Terms and Conditions
          </Link>
          .
        </p>
      </Block>
      <Block>
        <Row tag="p">
          <Col tag="span">
            <Button large href="/">Sign Out</Button>
          </Col>
          <Col tag="span">
            <Button
              large
              fill
              href={paths.welcomeReviewPath}
            >
              Continue
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
            <Link sheetClose>Close</Link>
          </div>
        </Toolbar>
        {/*  Scrollable sheet content */}
        <PageContent>
          <Block>
            <p>
              TODO: Terms and conditions go here.
            </p>
          </Block>
        </PageContent>
      </Sheet>
    </Page>
  }
}
