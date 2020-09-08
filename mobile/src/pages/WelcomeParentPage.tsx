/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { useGlobal, useState } from "reactn";

import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  Button,
  List,
  ListInput,
  ListItem,
  AccordionContent,
  Toolbar,
  Link,
  Row,
  Col,
  Icon,
  Sheet,
  PageContent
} from "framework7-react";

import { Case, When } from "../components/Case"

import pluralize from "pluralize"
import { timeOfDay } from "../util";
import { User } from '../common/models/user'


interface Props {}



interface State {
  termsOpened: boolean
}

export default class WelcomeParentPage extends React.Component<Props, State> {
  state: State = {
    termsOpened: false
  }

  totalLocations() {
    const user: User = this.global.currentUser
    return user.locations.length + user.children.map(x => x.locations.length).reduce((x, y) => x + y, 0)
  }

  whoDoYouFillSurveysFor() {
    const user = this.global.currentUser
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
      return `This may have been due to an error. Please contact greenlight at help@greenlighted.org`
    }
  }

  render() {
    return <Page>
      <Block>
        <h1>
          <Case test={timeOfDay()}>
            <When value="morning">Good Morning!</When>
            <When value="afternoon">Good Afternoon!</When>
            <When value="evening">Good Evening!</When>
          </Case>
        </h1>
        <p>
          You've been added by{' '}
          {pluralize('locations', this.totalLocations(), true)} to Greenlight's
          secure HIPAA and FERPA compliant COVID-19 monitoring platform.
        </p>
        <p>
          {this.whoDoYouFillSurveysFor()} We will not share any data without your
          permission.
        </p>
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
              href="/welcome-parent/review"
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae
              ducimus dolorum ipsa aliquid accusamus perferendis laboriosam...
            </p>
          </Block>
        </PageContent>
      </Sheet>
    </Page>
  }
}

