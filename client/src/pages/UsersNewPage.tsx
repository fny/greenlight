import React, {
  getGlobal, useEffect, useGlobal, useState,
} from 'reactn'
import {
  assertNotNull, assertNotUndefined, esExclaim, greeting,
} from 'src/util'

import welcomeDoctorImage from 'src/images/welcome-doctor.svg'
import {
  Page, Block, Sheet, Row, Button, Col, Link, PageContent, Toolbar, List, ListInput,
} from 'framework7-react'
import { Trans } from '@lingui/macro'
import { toggleLocale } from 'src/initializers/providers'
import { User, Location } from 'src/models'
import { F7Props } from 'src/types'
import { getLocation, joinLocation } from 'src/api'
import { paths } from 'src/routes'
import UserForm from './UsersForm'
import LoadingPage from './LoadingPage'

export default function UsersNewPage(props: F7Props) {
  const [page, setPage] = useState('')
  const [termsOpened, setTermsOpened] = useState(false)
  const { permalink, registrationCode } = props.f7route.params

  const [location, setLocation] = useState<Location | null>()
  const [error, setError] = useState<any>(null)
  const [error2, setError2] = useState<any>(null)

  const [myPermalink, setMyPermalink] = useState('')
  // setMyPermalink(permalink)
  const [myCode, setMyCode] = useState('')
  // setMyCode(registrationCode)
  const [currentUser] = useGlobal('currentUser')
  useEffect(() => {
    // HACK: This actually reveals the permalink since its in the payload
    if (!permalink) return
    console.log(permalink)
    console.log(location)
    getLocation(permalink).then(setLocation).catch(setError)
  }, [permalink])

  if (permalink && registrationCode && !location && !error) {
    return (
      <LoadingPage />
    )
  }

  if (!permalink || !registrationCode || error) {
    return (
      <Page>
        <Block>
          <h1>Look Up A Business</h1>
          <p>
            You should have received a link from or code from your business or school.
            If you received a code, enter it below. The code is not case sensitive.
          </p>
          {
            error && <p style={{ color: 'red' }}>There was an error looking up the business. Please make sure your information is correct.</p>
          }
          <List noHairlines>
            <ListInput type="text" label="Location ID" placeholder="Location ID" required onChange={(e) => setMyPermalink(e.target.value)} />
            <ListInput type="text" label="Registration Code" placeholder="Enter Your Registration Code Here" required onChange={(e) => setMyCode(e.target.value)} />
            <br />
            <Button href={`/l/${myPermalink}/code/${myCode}`} fill>
              Lookup Location
            </Button>
          </List>
        </Block>
      </Page>
    )
  }

  if (currentUser && location && currentUser.locationAccounts.filter((la) => la.locationId?.toString() === location.id).length > 0) {
    return (
      <Block>
        <h1>Registered for This Location</h1>
        <p>
          You are registered to submit survey to {location.name}.
        </p>
        {
          currentUser.hasCompletedWelcome()
            ? <Button fill href={paths.dashboardPath}>Return to Dashboard</Button>
            : <Button fill href={paths.welcomeSurveyPath}>Submit Your First Survey</Button>
        }

      </Block>
    )
  }

  if (currentUser && location) {
    return (
      <Block>
        <h1>Join {location.name}</h1>
        <p>
          Click the button below to allow {location.name} to receive your survey results.
        </p>
        {error2 && <p>Something went wrong. Please try again or contact us at help@greenlightready.com</p>}
        <Button
          fill
          onClick={() => {
            joinLocation(location).then(() => { window.location.reload() }).catch(setError2)
          }}
        >Join Business
        </Button>
      </Block>
    )
  }

  if (!currentUser && permalink && registrationCode && page === 'register') {
    assertNotNull(location)
    assertNotUndefined(location)
    return (
      <Page>
        <Block>
          <h1>Create Your Account</h1>
          <p>
            Fill in the information below to create your account for {location.name}
          </p>
          <UserForm user={new User()} f7router={props.f7router} />
        </Block>
      </Page>
    )
  }

  if (!currentUser && permalink && registrationCode && page === '') {
    return (
      <Page>
        <Block>
          <h1>
            {esExclaim()}{greeting()}!&nbsp;&nbsp;
            {/* <Link style={{ fontSize: '12px' }} onClick={() => toggleLocale()}>
              <Trans id="WelcomePage.toggle_locale">En Español</Trans>
            </Link> */}
          </h1>
          <p>
            You're about to join Greenlight's secure COVID-19 monitoring platform.
            Every day you'll need to fill out symptom surveys for yourself.
            You will also get access to health and social support in your community.
          </p>
          <p>
            Your data is secure and stored by a HIPAA and FERPA-compliant cloud provider.
            {' '}
            <i>We will not share any data without your permission.</i>
          </p>
          <img alt="Welcome to Greenlight!" src={welcomeDoctorImage} />
          <p>
            <Trans id="WelcomePage.terms_and_conditions">
              By continuing, you accept Greenlight's{' '}
              <Link
                onClick={() => {
                  setTermsOpened(true)
                }}
              > Terms and Conditions
              </Link>.
            </Trans>
          </p>
        </Block>
        <Block>
          <Row tag="p">
            <Col tag="span">
              <Button
                large
                fill
                onClick={() => {
                  setPage('register')
                }}
              >
                <Trans id="Common.continue">Continue</Trans>
              </Button>
            </Col>
          </Row>
        </Block>
        <Sheet
          opened={termsOpened}
          onSheetClosed={() => {
            setTermsOpened(false)
          }}
        >
          <Toolbar>
            <div className="left" />
            <div className="right">
              <Link sheetClose><Trans id="Common.close">Close</Trans></Link>
            </div>
          </Toolbar>
          {/*  Scrollable sheet content */}
          <PageContent>
            {/* TODO: Host this elsewhere. */}
            <iframe src="/terms.html" style={{ width: '100%', border: 0, height: '90%' }} />
          </PageContent>
        </Sheet>
      </Page>
    )
  }

  return <></>
}
