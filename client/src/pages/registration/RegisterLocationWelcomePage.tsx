import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, Link, Page, PageContent, Row, Sheet, Toolbar,
} from 'framework7-react'
import React, { useState } from 'react'
import { toggleLocale } from 'src/helpers/global'

import welcomeDoctorImage from 'src/assets/images/welcome-doctor.svg'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import Redirect from 'src/components/Redirect'
import { User } from 'src/models'

import './RegisterLocationPages.css'

export default function RegisterLocationWelcomePage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  const [state, setState] = useState({ termsOpened: false })

  if (currentUser) {
    return <Redirect to={paths.registerLocationDetailsPath} f7router={props.f7router} />
  }

  return (
    <Page className="RegisterLocationPages">

      <Block>
        <h1>
          Welcome!
          <Link style={{ fontSize: '12px', paddingLeft: '1rem' }} onClick={() => toggleLocale()}>
            <Trans id="Common.toggle_locale">En Español</Trans>
          </Link>
        </h1>

        <p>
          Greenlight provides a suite of COVID-19 monitoring tools to keep
          schools, business, and organizations of different sizes safe, healthy, and opened:
          <ul>
            <li>COVID-19 monitoring</li>
            <li>COVID-19 relief payments</li>
            <li>Guidance from experts in times of crisis</li>
            <li>Social services support</li>
            <li>Testing access</li>
            <li>Vaccine tracking</li>
          </ul>
        </p>

        <p>
          Greenlight is free or subsidized in many locations! Continue to learn
          more about what's available in your area.
        </p>
        <p style={{ textAlign: 'center' }}>
          <img alt="Welcome to Greenlight!" src={welcomeDoctorImage} height="150px" />
        </p>

        <p>
          <Trans id="RegisterLocationWelcomePage.terms_and_conditions">
            By continuing, you accept Greenlight's{' '}
            <Link
              onClick={() => {
                setState({ ...state, termsOpened: true })
              }}
            > Terms and Conditions
            </Link>.
          </Trans>
        </p>
      </Block>
      <Block>
        <Row tag="p">
          <Col tag="span">
            <Button large href={paths.splashPath}>
              <Trans id="Common.back_home">Back Home</Trans>
            </Button>
          </Col>
          <Col tag="span">
            <Button
              large
              fill
              href={paths.registerLocationIntroductionPath}
            >
              <Trans id="Common.continue">Continue</Trans>
            </Button>
          </Col>
        </Row>
      </Block>

      <Sheet
        opened={state.termsOpened}
        onSheetClosed={() => {
          setState({ ...state, termsOpened: false })
        }}
      >
        <Toolbar>
          <div className="left" />
          <div className="right">
            <Link sheetClose><Trans id="Common.close">Close</Trans></Link>
          </div>
        </Toolbar>

        <PageContent> {/*  Use this to make sheet scrollable */}
          <iframe
            title={
              t({ id: 'Common.terms_and_conditions', message: 'Terms and Conditions' })
            }
            src="https://docs.greenlightready.com/terms"
            style={{ width: '100%', border: 0, height: '90%' }}
          />
        </PageContent>
      </Sheet>
    </Page>
  )
}
