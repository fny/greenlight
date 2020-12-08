import React, {
  useEffect, useGlobal, useState,
} from 'reactn'
import {
  assertNotNull, assertNotUndefined, esExclaim, greeting,
} from 'src/helpers/util'

import welcomeDoctorImage from 'src/assets/images/welcome-doctor.svg'
import {
  Page, Block, Sheet, Row, Button, Col, Link, PageContent, Toolbar, List, ListInput, Navbar,
} from 'framework7-react'
import { t, Trans } from '@lingui/macro'
import { User, Location } from 'src/models'
import { F7Props } from 'src/types'
import { getLocation, joinLocation } from 'src/api'
import { paths } from 'src/config/routes'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import LoadingPage from 'src/pages/util/LoadingPage'
import UserForm from './UsersForm'

export default function RegisterParentPage(props: F7Props) {
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
  const [currentUser] = useGlobal('currentUser') as [User, any] // FIXME
  useEffect(() => {
    // HACK: This actually reveals the registration code since its in the response payload
    if (!permalink) return
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
        <Navbar title={t({ id: 'ParentRegistration.lookup_school_title', message: 'Look Up School' })}>
          <NavbarHomeLink slot="left" />
        </Navbar>
        <Block>
          <p>
            <Trans id="ParentRegistration.lookup_school_instructions">
              You should have received a link from or code from your school.
              If you received a code, enter it below. The code is not case sensitive.
            </Trans>
          </p>
          {
            error && (
            <p style={{ color: 'red' }}>
              <Trans id="ParentRegistration.lookup_error">
                There was an error looking up your school. Please make sure your information is correct.
              </Trans>
            </p>
            )
          }
          <List noHairlines>
            <ListInput
              type="text"
              label={t({ id: 'ParentRegistration.school_id', message: 'School ID' })}
              placeholder={t({ id: 'ParentRegistration.school_id', message: 'School ID' })}
              required
              onChange={(e) => setMyPermalink(e.target.value)}
            />
            <ListInput
              type="text"
              label={t({ id: 'ParentRegistration.registration_code_label', message: 'Registration Code' })}
              placeholder={t({ id: 'ParentRegistration.registration_code_placeholder', message: 'Enter your registration code' })}
              required
              onChange={(e) => setMyCode(e.target.value)}
            />
            <br />
            <Button href={`/l/${myPermalink}/code/${myCode}`} fill>
              <Trans id="ParentRegistration.lookup_location">
                Lookup Location
              </Trans>
            </Button>
          </List>
        </Block>
      </Page>
    )
  }

  if (currentUser && location && currentUser.locationAccounts.filter((la) => la.locationId?.toString() === location.id).length > 0) {
    return (
      <Page>
        <Navbar
          title={
          t({ id: 'SchoolRegistered.success_title', message: 'Account Linked' })
          }
        >
          <NavbarHomeLink slot="left" />
        </Navbar>
        <Block>
          <h1>
            <Trans id="schoolRegistered.success_header">
              Registered for {location.name}
            </Trans>
          </h1>
          <p>
            <Trans id="schoolRegistered.success_message">
              You are registered to submit check in to {location.name}.
            </Trans>
          </p>
          {
          currentUser.hasCompletedWelcome()
            ? (
              <Button fill href={paths.dashboardPath}>
                <Trans id="schoolRegistered.return_to_dashboard">
                  Return to Dashboard
                </Trans>
              </Button>
            )
            : (
              <Button fill href={paths.welcomeSurveyPath}>
                <Trans id="schoolRegistered.submit_first_survey">
                  Submit Your First Survey
                </Trans>
              </Button>
            )
        }
        </Block>
      </Page>
    )
  }

  if (currentUser && location) {
    return (
      <Page>
        <Navbar title={t({ id: 'schoolRegistered.connect_title', message: 'Connect with a school' })}>
          <NavbarHomeLink slot="left" />
        </Navbar>
        <Block>
          <h1>
            <Trans id="schoolRegistered.connect_heading">
              Link to {location.name}
            </Trans>
          </h1>
          <p>
            <Trans id="schoolRegistered.connect_message1">
              Thank you for creating your account! {location.name} has
              decided to implement Greenlight Durham and may
              require that you complete daily check-in’s to work on
              site. You have the option to share your daily check-in
              status with {location.name} through Greenlight. Note that only
              your status (green, yellow, pink) is shared with {location.name},
              not your detailed symptoms or medical information.
              Even if you agree to share updates with {location.name} at this
              time, you can stop sharing updates at any time.
            </Trans>
          </p>
          <p>
            <Trans id="schoolRegistered.connect_message2">
              Click the button below to allow {location.name} to receive your check-in status.
            </Trans>
          </p>
          {error2 && (
          <p>
            <Trans id="schoolRegistered.connect_error">
              Something went wrong. Please try again or contact us at help@greenlightready.com
            </Trans>
          </p>
          )}
          <Button
            fill
            onClick={() => {
              joinLocation(location).then(() => { window.location.reload() }).catch(setError2)
            }}
          >
            <Trans id="schoolRegistered.join_school">
              Join school
            </Trans>
          </Button>
        </Block>
      </Page>
    )
  }

  if (!currentUser && permalink && registrationCode && page === 'register') {
    assertNotNull(location)
    assertNotUndefined(location)
    return (
      <Page>
        <Navbar title={t({ id: 'schoolRegistered.new_account', message: 'Create a New Account' })}>
          <NavbarHomeLink slot="left" />
        </Navbar>
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
            <Trans id="schoolRegistered.welcome1">
              You're about to join Greenlight's secure COVID-19 monitoring platform.
              Every day you'll need to fill out symptom surveys for yourself.
              You will also get access to health and social support in your community.
            </Trans>
          </p>
          <p>
            <Trans id="schoolRegistered.welcome2">
              Your data is secure and stored by a HIPAA and FERPA-compliant cloud provider. <i>We will not share any data without your permission.</i>
            </Trans>
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