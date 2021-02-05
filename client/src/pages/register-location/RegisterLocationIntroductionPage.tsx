import {
  Block, Button, Col, f7, Link, List, ListItem, Page, PageContent, Row, Sheet, Toolbar,
} from 'framework7-react'
import React, { useState } from 'react'
import {
  isBlank, upperCaseFirst,
} from 'src/helpers/util'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import {
  lcPeople, lcTrans, LocationCategories, LOCATION_CATEGORIES,
} from 'src/models/Location'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import LocalStorage from 'src/helpers/LocalStorage'
import { User } from 'src/models'

import './RegisterLocationPages.css'
import logger from 'src/helpers/logger'
import { getEmailTaken } from 'src/api'
import GLPhoneNumber from 'src/helpers/GLPhoneNumber'
import Framework7 from 'framework7'
import { Router } from 'framework7/modules/router/router'
import Tr, { En, Es, tr } from 'src/components/Tr'

import welcomeImage from 'src/assets/images/illustrations/hello.png'

class State {
  locationCategoriesOpened = false

  showErrors = false

  termsOpened = false

  emailTaken = false
}

function validateUser(user: RegisteringUser) {
  const errors = []
  if (isBlank(user.firstName)) errors.push('firstName')
  if (isBlank(user.lastName)) errors.push('lastName')
  if (isBlank(user.email)) errors.push('email')
  if (!/@/.test(user.email)) errors.push('email')
  return errors
}

function validateLocation(location: RegisteringLocation) {
  const errors = []
  if (isBlank(location.name)) errors.push('locationName')
  if (isBlank(location.zipCode)) errors.push('zipCode')
  if (!/^\d{5}$/.test(location.zipCode)) errors.push('zipCode')
  if (isBlank(location.category)) errors.push('category')
  if (isBlank(location.employeeCount)) errors.push('employeeCount')
  return errors
}

async function submit(f7: Framework7, f7router: Router.Router, state: State, setState: React.Dispatch<React.SetStateAction<State>>,
  registeringUser: RegisteringUser, registeringLocation: RegisteringLocation) {
  setState({ ...state, showErrors: true })
  if (validateLocation(registeringLocation).length !== 0 || validateUser(registeringUser).length !== 0) {
    logger.dev('Location not validated',
      validateLocation(registeringLocation),
      validateUser(registeringUser))
    return
  }
  f7.dialog.preloader(tr({ en: 'Validating your email...', es: 'Validando su correo electrónico...' }))
  let emailTaken
  try {
    emailTaken = await getEmailTaken(registeringUser.email)
  } catch (e) {
    f7.dialog.close()
    f7.dialog.alert(
      tr({ en: "Couldn't connect to Greenlight to validate your email address.", es: 'No se pudo conectar a Greenlight para validar su correo electrónico.' }),
      tr({ en: 'Submission Failed', es: 'Envío Fallido' }),
    )
    return
  }
  f7.dialog.close()
  setState({
    ...state, emailTaken,
  })

  if (emailTaken) {
    f7.dialog.alert(
      tr({ en: 'That email address is already in use. Please sign in to register a new location.', es: 'Esa dirección de correo electrónico ya está en uso. Inicie sesión para registrar una nueva ubicación.' }),
      tr({ en: 'Email Taken', es: 'Correo Electrónico Tomado' }),
    )
    return
  }
  LocalStorage.setRegisteringUser(registeringUser)
  LocalStorage.setRegisteringLocation(registeringLocation)
  f7router.navigate(paths.registerLocationMessagePath)
}

export default function RegisterLocationIntroductionPage(props: F7Props): JSX.Element {
  const [locale] = useGlobal('locale')

  const [currentUser] = useGlobal('currentUser')
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const [registeringLocation, setRegisteringLocation] = useGlobal('registeringLocation')
  const [state, setState] = useState(new State())

  return (
    <Page className="RegisterLocationPages">
      <Block>
        <h1>
          {
            currentUser
              ? (

                <Tr
                  en="Tell us about the organization you want to register."
                  es="Cuéntanos sobre la organización que quieres registrar."
                />
              )
              : (
                <Tr
                  en="Introduce yourself!"
                  es="¡Preséntese!"
                />
              )
          }

          {' '}
          <Link
            style={{ fontSize: '12px', paddingLeft: '1rem', textAlign: 'right' }}
            onClick={() => {
              LocalStorage.deleteRegisteringLocation()
              LocalStorage.deleteRegisteringUser()
              setRegisteringLocation(new RegisteringLocation())
              setRegisteringUser(new RegisteringUser())
            }}
          >
            <Tr en="Clear" es="Borrar" />
          </Link>
        </h1>

        {state.emailTaken && (
        <p className="error">
          <Tr>
            <En>
              That email is already in use. Please <a href={paths.signInPath}>sign in first</a> and then register a new organization.
            </En>
            <Es>
              El correo electrónico ya está en uso. <a href={paths.signInPath}>Inicie sesión primero </a> y luego registre una nueva organización.
            </Es>
          </Tr>
        </p>
        )}

        <p className={`introduction ${currentUser ? 'hide' : ''}`}>
          <Tr en="Hello, Greenlight! My name is" es="¡Hola, Greenlight! Me llamo" />
          <br />
          <input
            name="firstName"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('firstName') && 'has-error'}`}
            type="text"
            placeholder={tr({ en: 'First', es: 'Primero' })}
            value={registeringUser.firstName}
            onChange={(e) => {
              setRegisteringUser({ ...registeringUser, firstName: (e.target as HTMLInputElement).value })
            }}
          />
          {' '}
          <input
            name="lastName"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('lastName') && 'has-error'}`}
            type="text"
            value={registeringUser.lastName}
            placeholder={tr({ en: 'Last', es: 'Apellido' })}
            onChange={(e) => setRegisteringUser({ ...registeringUser, lastName: (e.target as HTMLInputElement).value })}
          />,
          <br />
          <Tr en="and my email is" es="y mi correo electrónico es" />
          <input
            name="email"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('email') && 'has-error'}`}
            type="email"
            placeholder={tr({ en: 'Email', es: 'Correo Electrónico' })}
            value={registeringUser.email}
            onChange={(e) => setRegisteringUser({ ...registeringUser, email: (e.target as HTMLInputElement).value })}
          />.
        </p>

        <p className="introduction">
          <Tr en="I want to register my" es="Quiero registrar mi" />
          <input
            name="locationCategory"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('category') && 'has-error'}`}
            type="text"
            placeholder={tr({ en: 'Community', es: 'Comunidad' })}
            onFocus={() => setState({ ...state, locationCategoriesOpened: true })}
            readOnly
            value={registeringLocation.category ? lcTrans(registeringLocation.category) : ''}
          />
          <br />
          <Tr en="called" es="llamdo" />
          <input
            name="locationName"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('locationName') && 'has-error'}`}
            type="text"
            placeholder={tr({ en: 'Name', es: 'Nombre' })}
            value={registeringLocation.name}
            onChange={(e) => setRegisteringLocation({ ...registeringLocation, name: (e.target as HTMLInputElement).value })}
          />
          <br />
          <Tr en="with about" es="con unos" />
          <input
            name="employeeCount"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('employeeCount') && 'has-error'}`}
            type="number"
            min="2"
            placeholder="#"
            value={registeringLocation.employeeCount || ''}
            onChange={(e) => setRegisteringLocation({ ...registeringLocation, employeeCount: parseInt((e.target as HTMLInputElement).value, 10) })}
          />
          {lcPeople(registeringLocation.category || LocationCategories.COMMUNITY)}
          <br />
          <Tr en="located in" es="ubicada en" />
          {' '}
          <input
            name="zipCode"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('zipCode') && 'has-error'}`}
            type="text"
            placeholder={tr({ en: 'Zip Code', es: 'Código Postal' })}
            value={registeringLocation.zipCode}
            onChange={(e) => setRegisteringLocation({ ...registeringLocation, zipCode: (e.target as HTMLInputElement).value })}
          />.
        </p>
      </Block>
      <div style={{ textAlign: 'center' }}>
        <img alt="Welcome to Greenlight!" src={welcomeImage} height="200px" />
      </div>
      <Block>
        <Row tag="p">
          <Col tag="span">
            <Button href={paths.registerLocationWelcomePath}>
              <Tr en="Back" es="Atrás" />
            </Button>
          </Col>
          <Col tag="span">
            <Button
              fill
              onClick={() => submit(f7, props.f7router, state, setState, registeringUser, registeringLocation)}
            >
              <Tr en="Continue" es="Seguir" />
            </Button>
          </Col>
        </Row>
      </Block>

      <Sheet
        key={locale}
        opened={state.locationCategoriesOpened}
        onSheetClosed={() => {
          setState({ ...state, locationCategoriesOpened: false })
        }}
      >
        <Toolbar>
          <div className="left" />
          <div className="right">
            <Link sheetClose><Tr en="Close" es="Cerrar" /></Link>
          </div>
        </Toolbar>

        <PageContent> {/*  Use this to make sheet scrollable */}
          <List noHairlines noChevron>
            {
            LOCATION_CATEGORIES.map((c) => (
              <ListItem
                key={c}
                radio
                value={c}
                name="category"
                title={upperCaseFirst(lcTrans(c))}
                onChange={(e) => {
                  setRegisteringLocation({ ...registeringLocation, category: e.target.value })
                  setState({ ...state, locationCategoriesOpened: false })
                }}
              />
            ))
          }
          </List>
        </PageContent>
      </Sheet>
    </Page>
  )
}
