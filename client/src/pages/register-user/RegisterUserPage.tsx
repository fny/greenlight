import React, {
  useEffect, useGlobal, useState, useMemo, Fragment, useCallback, getGlobal,
} from 'reactn'
import { useFormik, FormikProvider } from 'formik'
import {
  assertNotNull, assertNotUndefined, esExclaim, greeting,
} from 'src/helpers/util'

import welcomeDoctorImage from 'src/assets/images/welcome-doctor.svg'
import {
  f7, Page, Block, Sheet, Row, Button, Col, Link, PageContent, Toolbar, Navbar, List,
} from 'framework7-react'
import { t, Trans } from '@lingui/macro'
import { User, Location } from 'src/models'
import { F7Props } from 'src/types'
import {
  checkLocationRegistrationCode, getLocation, joinLocation, registerUser,
} from 'src/api'
import { paths } from 'src/config/routes'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import LoadingPage from 'src/pages/util/LoadingPage'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { Roles } from 'src/models/LocationAccount'
import FormikInput from 'src/components/FormikInput'
import { getKeyName } from 'src/helpers/util'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import { Router } from 'framework7/modules/router/router'
import LocalStorage from 'src/helpers/LocalStorage'
import { LocationCategories } from 'src/models/Location'
import Tr, { En, Es, tr } from 'src/components/Tr'
import TermsAndConditionsSheet from 'src/components/TermsAndConditionsSheet'
import EmailSupportLink from 'src/components/EmailSupportLink'
import RegisterUserForm from './RegisterUserForm'
import { getStatusProps } from 'react-query/types/core/utils'

export default function RegisterUserPage(props: F7Props) {
  const [page, setPage] = useState('')
  const [currentUser] = useGlobal('currentUser') as [User, any] // FIXME
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const { locationId } = useMemo(() => props.f7route.params, [props.f7route.params])

  assertNotUndefined(locationId)

  const submitHandler = useMemo(
    () => new SubmitHandler(f7, {
      onSuccess: () => {
        props.f7router.navigate(paths.welcomeSurveyPath)
      },
      errorTitle: 'Something went wrong',
      errorMessage: 'User registration is failed',
    }),
    [],
  )

  const handleRegisterUser = useCallback(
    async (user: RegisteringUser) => {
      await setRegisteringUser(user)
      LocalStorage.setRegisteringUser(user)
      const { registeringUserDetail } = getGlobal()
      if (user.role === Roles.Student || user.role === Roles.Staff) {
        // create user
        submitHandler.submit(async () => {
          await registerUser(locationId, { ...user, password: registeringUserDetail })
        })
      } else {
        // go to add children
        props.f7router.navigate(`/go/${locationId}/register/children`)
      }
    },
    [submitHandler],
  )

  return (
    <Page>
      <LoadingLocationContent
        showNavbar
        showAsPage
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)

          if (
            currentUser && currentUser.isMemberOf(location)
          ) {
            return <CurrentUserAlreadyRegisteredPage currentUser={currentUser} location={location} />
          }

          if (currentUser) {
            return (
              <CreateLocationAccountPage
                location={location}
                onParentalLA={() => props.f7router.navigate(`/go/${locationId}/register/children`)}
              />
            )
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
                onRegister={handleRegisterUser}
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
          {greeting()}!
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
      <TermsAndConditionsSheet
        opened={termsOpened}
        onClose={() => {
          setTermsOpened(false)
        }}
      />
    </Fragment>
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
      <Navbar title={tr({ en: 'Account Linked', es: 'Cuenta Conectada' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <h1>
          <Tr en={`Registered for ${location.name}`} es={`Registrado para ${location.name}`} />
        </h1>
        <p>
          <Tr en={`You are registered to submit check ins to ${location.name}.`} es={`Está registrado para enviar encuestas a ${location.name}`} /> {
            location.isSchool() && <>
              To add children to this school, visit "My Children" on the settings page.
            </>
          }
        </p>
        {currentUser.hasCompletedWelcome() ? (
          <Button fill href={paths.dashboardPath}>
            <Tr en="Return to Dashboard" es="Volver a Panel Pricipal" />
          </Button>
        ) : (
          <Button fill href={paths.welcomeSurveyPath}>
            <Tr en="Submit Your First Check In" es="Enviar Su Primera Encuesta" />
          </Button>
        )}
      </Block>
    </Fragment>
  )
}

function CreateLocationAccountPage({
  location,
  onParentalLA,
}: {
  location: Location,
  onParentalLA: () => void,
}): JSX.Element {
  const [error, setError] = useState<any>()
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const handleJoinLocation = useCallback(async (role: Roles) => {
    try {
      await joinLocation(location, role)
      window.location.reload()
    } catch (err) {
      setError(err)
    }
  }, [location])

  const formik = useFormik<RegisteringUser>({
    initialValues: {
      ...registeringUser,
    },
    onSubmit: async (values) => {
      if (values.role === Roles.Unknown) {
        values.role = values.availableRoles[0]
      }

      if (values.role === Roles.Student || values.role === Roles.Staff) {
        handleJoinLocation(values.role)
      } else {
        await setRegisteringUser(values)
        LocalStorage.setRegisteringUser(values)
        // go to add children
        onParentalLA()
      }
    },
  })

  return (
    <Fragment>
      <Navbar title={tr({ en: 'Connect to a New Location', es: 'Conectarse a un Nuevo Lugar' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <h1>
          <Tr en={`Link to ${location.name}`} es={`Unitar con ${location.name}`} />
        </h1>
        <p>
          <Tr>
            <En>
              {location.name} has decided to implement Greenlight and may
              require that you complete daily check-in's. Only your status (green, yellow, pink) is shared
              with {location.name}, not your detailed symptoms or medical information unless there is medical staff on site.
              You can stop sharing information at any time.
            </En>
            <Es>
              {location.name} ha decidido implementar Greenlight Durham y puede
              requiere que complete las encuestas diarias. Solo se comparte su estado (verde, amarillo, rosa)
              con {location.name}, no sus síntomas detallados o información médica a menos que haya personal médico en el lugar.
              Puede dejar de compartir información en cualquier momento.
            </Es>
          </Tr>
        </p>
        <p>
          <Tr
            en={`Click the button below to allow ${location.name} to receive your check-in status.`}
            es={`Haga clic en el botón de abajo para permitir que ${location.name} reciba su estado de salud.`}
          />
        </p>
        {error && (
          <p>
            <Tr>
              <En>
                Something went wrong. Please try again or contact us at <EmailSupportLink />
              </En>
              <Es>
                Algo salió mal. Vuelva a intentarlo o contáctenos a <EmailSupportLink />
              </Es>
            </Tr>
          </p>
        )}
        <FormikProvider value={formik}>
          <List
            noHairlines
            form
            onSubmit={(e) => {
              e.preventDefault()
              formik.submitForm()
            }}
          >
            {formik.values.availableRoles.length > 0 && (
              <FormikInput label={tr({ en: 'Role', es: 'Papel' })} name="role" type="select" floatingLabel>
                {formik.values.availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {getKeyName(Roles, role)}
                  </option>
                ))}
              </FormikInput>
            )}
            <Button fill type="submit">
              <Tr en="Join Location" es="Unitar" />
            </Button>
          </List>
        </FormikProvider>
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
        <h1>
          <Tr en="Create Your Account" es="Crear Su Cuenta" />
        </h1>
        <p>
          <Tr
            en={`Fill in the information below to create your account for ${location.name}`}
            es={`Complete la siguiente información para crear su cuenta para ${location.name}`}
          />
        </p>
        <Link
          style={{ fontSize: '12px', paddingLeft: '1rem', textAlign: 'right' }}
          onClick={() => {
            LocalStorage.deleteRegisteringLocation()
            LocalStorage.deleteRegisteringUser()
            window.location.reload()
          }}
        >
          <Tr en="Clear" es="Borrar" />
        </Link>
        <RegisterUserForm user={registeringUser} onUpdateUser={onRegister} />
      </Block>
    </Fragment>
  )
}
