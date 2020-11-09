import React from 'react'
import {
  Page, Navbar, Block, Link,
} from 'framework7-react'
import { defineMessage, Trans } from '@lingui/macro'
import { getGlobal } from 'reactn'

export default function DukeScheduleTestPage() {
  return (
    <Page>
      <Navbar
        title={getGlobal().i18n._(defineMessage({ id: 'DukeScheduleTestPage.title', message: 'Schedule a Test' }))}
        backLink={getGlobal().i18n._(defineMessage({ id: 'Common.back', message: 'Back' }))}
      />
      <Block strong>
        <p>
          <Trans id="DukeScheduleTestPage.instructions1">
            From 8:00am to 5pm, please call the number below to schedule a test.
            Dial 2 when you here the automated voice to reach the patient line.
          </Trans>
        </p>

        <p style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          <Trans id="DukeScheduleTestPage.instructions2">Call <a href="tel:919-385-0429">919-385-0429</a>, then Dial 2</Trans>
        </p>

        <p><Trans id="DukeScheduleTestPage.instructions3">Tell whomever you speak with that you need to schedule a test and you use the Greenlight app.</Trans></p>

        <p>
          <Trans id="DukeScheduleTestPage.instructions4">
            You should be scheduled within 24 hours and recieve a result the following day.
            You should not need to schedule an appointment before the test.
          </Trans>
        </p>

        <p><Trans id="DukeScheduleTestPage.resources_title">More resources:</Trans></p>
        <ul>
          <li>
            <Link external href="https://covid19.ncdhhs.gov/about-covid-19/testing/steps-take-after-covid-19-testing">
              <Trans id="DukeScheduleTestPage.steps_after_test">Steps to take after a test</Trans>
            </Link>
          </li>
          <li>
            <Link external href="https://www.mayoclinic.org/vid-20483784">
              <Trans id="DukeScheduleTestPage.supporting_child">Supporting Your Child During COVID-19 Nasal Swab Testing</Trans>
            </Link>
          </li>
        </ul>
      </Block>
    </Page>
  )
}
