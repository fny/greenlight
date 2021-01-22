import React, { useEffect, useGlobal, useState, useMemo, Fragment, useCallback } from 'reactn'
import { assertNotNull, assertNotUndefined, esExclaim, greeting } from 'src/helpers/util'

import welcomeDoctorImage from 'src/assets/images/welcome-doctor.svg'
import { f7, Page, Block, Sheet, Row, Button, Col, Link, PageContent, Toolbar, Navbar } from 'framework7-react'
import { t, Trans } from '@lingui/macro'
import { User, Location } from 'src/models'
import { F7Props } from 'src/types'
import { checkLocationRegistrationCode, getLocation, joinLocation, registerUser } from 'src/api'
import { paths } from 'src/config/routes'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import LoadingPage from 'src/pages/util/LoadingPage'
import UserForm from './UsersForm'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { Roles } from 'src/models/LocationAccount'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import { Router } from 'framework7/modules/router/router'
import LocalStorage from 'src/helpers/SessionStorage'
import { LocationCategories } from 'src/models/Location'

export default function RegisterUserPage(props: F7Props) {
  const [page, setPage] = useState('')
  const [currentUser] = useGlobal('currentUser') as [User, any] // FIXME
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const { locationId } = useMemo(() => props.f7route.params, [props.f7route.params])

  assertNotUndefined(locationId)

  const handleRegisterUser = useCallback(async (user: RegisteringUser, location: Location) => {
    setRegisteringUser(user)
    LocalStorage.setRegisteringUser(user)

    if (user.role === Roles.Student || user.role === Roles.Staff) {
      // create user
      registerUser(location.id, user)
    } else {
      // go to add children
      props.f7router.navigate(`/l/${locationId}/register/children`)
    }
  }, [])

  return (
    <Page>
      <LoadingLocationContent
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)

          if (
            currentUser &&
            currentUser.locationAccounts.filter((la) => la.locationId?.toString() === location.id).length > 0
          ) {
            return <CurrentUserAlreadyRegisteredPage currentUser={currentUser} location={location} />
          }

          if (currentUser) {
            return <CreateLocationAccountPage location={location} />
          }

          if (!registeringUser || registeringUser.registrationCode === '') {
            props.f7router.navigate(`/go/${locationId}`)
            return <div />
          }

          if (page === 'register') {
            return (
              <CreateAccountPage
                location={location}
                registeringUser={registeringUser}
                onRegister={(user) => handleRegisterUser(user, location)}
              />
            )
          }

          return <WelcomePage setPage={setPage} />
        }}
      />
    </Page>
  )
}

interface WelcomePageProps {
  setPage: (page: string) => void
}

function WelcomePage({ setPage }: WelcomePageProps): JSX.Element {
  const [termsOpened, setTermsOpened] = useState(false)

  return (
    <Fragment>
      <Block>
        <h1>
          {esExclaim()}
          {greeting()}!&nbsp;&nbsp;
          {/* <Link style={{ fontSize: '12px' }} onClick={() => toggleLocale()}>
        <Trans id="WelcomePage.toggle_locale">En Español</Trans>
      </Link> */}
        </h1>
        <p>
          <Trans id="locationRegistered.welcome1">
            You're about to join Greenlight's secure COVID-19 monitoring platform. Every day you'll need to fill out
            symptom surveys for yourself. You will also get access to health and social support in your community.
          </Trans>
        </p>
        <p>
          <Trans id="locationRegistered.welcome2">
            Your data is secure and stored by a HIPAA and FERPA-compliant cloud provider.{' '}
            <i>We will not share any data without your permission.</i>
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
            >
              {' '}
              Terms and Conditions
            </Link>
            .
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
            <Link sheetClose>
              <Trans id="Common.close">Close</Trans>
            </Link>
          </div>
        </Toolbar>
        {/*  Scrollable sheet content */}
        <PageContent>
          {/* TODO: Host this elsewhere. */}
          <iframe src="https://docs.greenlightready.com/terms" style={{ width: '100%', border: 0, height: '90%' }} />
        </PageContent>
      </Sheet>
    </Fragment>
  )
}

export function CheckLocationCodePage(props: F7Props): JSX.Element {
  const { permalink, registrationCode } = useMemo(() => {
    return props.f7route.params
  }, [props.f7route.params])
  const [, setRegisteringUser] = useGlobal('registeringUser')

  assertNotUndefined(permalink)
  assertNotUndefined(registrationCode)

  const submitHandler = new SubmitHandler(f7, {
    onSuccess: (result) => {
      const registeringUser = new RegisteringUser()
      registeringUser.registrationCode = registrationCode
      if (result === 'not school') {
        registeringUser.isStudent = null
      } else {
        registeringUser.isStudent = result === 'parent or student'
      }
      setRegisteringUser(registeringUser)

      // !TODO: the page does not change if we don't wait for a reasonable time.
      setTimeout(() => {
        console.log('navigate')
        props.f7router.navigate(`/l/${permalink}/register/user`)
      }, 500)
    },
    errorTitle: 'Incorrect Code',
    errorMessage: 'The registration code you input is incorrect. Please try again with correct code!',
    onError: () => {
      props.f7router.back()
    },
    onSubmit: async () => {
      return await checkLocationRegistrationCode(permalink, registrationCode)
    },
  })

  useEffect(() => {
    submitHandler.submit()
  }, [])

  return (
    <Page>
      <LoadingPage />
    </Page>
  )
}

function CurrentUserAlreadyRegisteredPage({
  currentUser,
  location,
}: {
  currentUser: User
  location: Location
}): JSX.Element {
  return (
    <Fragment>
      <Navbar title={t({ id: 'locationRegistered.success_title', message: 'Account Linked' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <h1>
          <Trans id="locationRegistered.success_header">Registered for {location.name}</Trans>
        </h1>
        <p>
          <Trans id="locationRegistered.success_message">
            You are registered to submit check in to {location.name}.
          </Trans>
        </p>
        {currentUser.hasCompletedWelcome() ? (
          <Button fill href={paths.dashboardPath}>
            <Trans id="locationRegistered.return_to_dashboard">Return to Dashboard</Trans>
          </Button>
        ) : (
          <Button fill href={paths.welcomeSurveyPath}>
            <Trans id="locationRegistered.submit_first_survey">Submit Your First Survey</Trans>
          </Button>
        )}
      </Block>
    </Fragment>
  )
}

function CreateLocationAccountPage({ location }: { location: Location }): JSX.Element {
  const [error, setError] = useState<any>()
  const handleJoinLocation = useCallback(async () => {
    try {
      await joinLocation(location)
      window.location.reload()
    } catch (err) {
      setError(err)
    }
  }, [location])

  return (
    <Fragment>
      <Navbar title={t({ id: 'locationRegistered.connect_title', message: 'Connect with a school' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <h1>
          <Trans id="locationRegistered.connect_heading">Link to {location.name}</Trans>
        </h1>
        <p>
          <Trans id="locationRegistered.connect_message1">
            Thank you for creating your account! {location.name} has decided to implement Greenlight Durham and may
            require that you complete daily check-in’s to work on site. You have the option to share your daily check-in
            status with {location.name} through Greenlight. Note that only your status (green, yellow, pink) is shared
            with {location.name}, not your detailed symptoms or medical information. Even if you agree to share updates
            with {location.name} at this time, you can stop sharing updates at any time.
          </Trans>
        </p>
        <p>
          <Trans id="locationRegistered.connect_message2">
            Click the button below to allow {location.name} to receive your check-in status.
          </Trans>
        </p>
        {error && (
          <p>
            <Trans id="locationRegistered.connect_error">
              Something went wrong. Please try again or contact us at help@greenlightready.com
            </Trans>
          </p>
        )}
        <Button fill onClick={handleJoinLocation}>
          <Trans id="locationRegistered.join_location">Join location</Trans>
        </Button>
      </Block>
    </Fragment>
  )
}

function CreateAccountPage({
  location,
  registeringUser,
  onRegister,
}: {
  location: Location
  registeringUser: RegisteringUser
  onRegister: (user: RegisteringUser) => void
}): JSX.Element {
  return (
    <Fragment>
      <Navbar title={t({ id: 'locationRegistered.new_account', message: 'Create a New Account' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <h1>Create Your Account</h1>
        <p>Fill in the information below to create your account for {location.name}</p>
        <UserForm user={registeringUser} onUpdateUser={onRegister} isStudent={registeringUser.isStudent} />
      </Block>
    </Fragment>
  )
}
