import React from 'react'
import {
  Page, Navbar, Block, Link,
} from 'framework7-react'
import { t, Trans } from '@lingui/macro'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import EmailSupportLink from 'src/components/EmailSupportLink'

export default function DukeScheduleTestPage(): JSX.Element {
  return (
    <Page>
      <Navbar
        title={t({ id: 'DukeScheduleTestPage.title', message: 'Schedule a Test' })}
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block strong>
        <p>
          <Trans id="DukeScheduleTestPage.instructions1">
            From 8:00am to 5pm, please call the number below to schedule a test.
            Dial 2 when you hear the automated voice to reach the patient line.
          </Trans>
        </p>

        <p style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          <Trans id="DukeScheduleTestPage.instructions2">Call <a href="tel:1-919-385-0429" target="_blank">919-385-0429</a>, then Dial 2</Trans>
        </p>

        <p><Trans id="DukeScheduleTestPage.instructions3">Tell whomever you speak with that you need to schedule a test and you use the Greenlight app.</Trans></p>

        <p>
          <Trans id="DukeScheduleTestPage.instructions4">
            You should be scheduled within 24 hours and receive a result the following day.
            If you <b>have symptoms</b>, you may need to schedule a <b>telemedicine appointment</b> prior to testing.
          </Trans>
        </p>

        <p>
          <Trans id="DukeScheduleTestPage.instructions5">
            Before the holidays, Duke had significant delays. This has been resolved.
            If you experience significant delays, please let us know: <EmailSupportLink />.
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
        <p>

          <Trans id="DukeScheduleTestPage.support">
            Still need help? Contact Greenlight support <a href="mailto:help@greenlightready.com" target="_blank">help@greenlightready.com</a>
          </Trans>
        </p>
      </Block>
    </Page>
  )
}
