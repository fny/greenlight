import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, Link, List, ListItem, Page, PageContent, Row, Sheet, Toolbar,
} from 'framework7-react'
import React, { useEffect, useState } from 'react'
import {
  assertNotNull, isBlank, isInDurham, upperCaseFirst,
} from 'src/helpers/util'
import { GRegisteringLocation, GRegisteringUser, toggleLocale } from 'src/initializers/providers'
import {
  lcPeople, lcTrans, LocationCategories, LOCATION_CATEGORIES,
} from 'src/models/Location'
import { toggleLocale } from 'src/helpers/global'
import welcomeDoctorImage from 'src/assets/images/welcome-doctor.svg'
import { dynamicPaths, paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import SessionStorage from 'src/helpers/SessionStorage'
import Redirect from 'src/components/Redirect'
import { User } from 'src/models'

import './RegisterLocationWelcomePage.css'
import logger from 'src/helpers/logger'
import { RegisterLocationMessageIds } from './RegisterLocationMessagePage'

class State {
  locationCategoriesOpened = false

  showErrors = false

  termsOpened = false
}

function validateUser(user: GRegisteringUser) {
  const errors = []
  if (isBlank(user.firstName)) errors.push('firstName')
  if (isBlank(user.lastName)) errors.push('lastName')
  return errors
}

function validateLocation(location: GRegisteringLocation) {
  const errors = []
  if (isBlank(location.zipCode)) errors.push('zipCode')
  if (!/^\d{5}$/.test(location.zipCode)) errors.push('zipCode')
  if (isBlank(location.category)) errors.push('category')
  console.log(location.employeeCount)
  if (isBlank(location.employeeCount)) errors.push('employeeCount')
  return errors
}

export function nextMessage(location: GRegisteringLocation): RegisterLocationMessageIds {
  assertNotNull(location.zipCode)
  assertNotNull(location.category)
  assertNotNull(location.employeeCount)

  // Schools must contact us
  if (location.category === LocationCategories.SCHOOL) {
    return 'school'
  }

  // Outside of durham must contact us
  if (!isInDurham(location.zipCode)) {
    return 'not-durham'
  }

  if (location.employeeCount > 100) {
    return 'durham-large'
  }

  return 'durham'
}

export default function RegisterLocationWelcomePage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser') as [User, any]
  const [locale] = useGlobal('locale')
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const [registeringLocation, setRegisteringLocation] = useGlobal('registeringLocation')
  const [state, setState] = useState(new State())

  if (currentUser) {
    return <Redirect to={paths.registerLocationDetailsPath} router={props.f7router} />
  }

  return (
    <Page className="RegisterLocationWelcomePage">
      <Block>
        <h1>
          Introduce yourself.
          {' '}
          <Link style={{ fontSize: '12px', paddingLeft: '1rem' }} onClick={() => toggleLocale()}>
            <Trans id="Common.toggle_locale">En Español</Trans>
          </Link>
        </h1>
        <p className="introduction">
          Hello, Greenlight! My name is
          <br />
          <input
            name="firstName"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('firstName') && 'has-error'}`}
            type="text"
            placeholder="First"
            onChange={(e) => {
              setRegisteringUser({ ...registeringUser, firstName: (e.target as HTMLInputElement).value })
            }}
          />
          {' '}
          <input
            name="lastName"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('lastName') && 'has-error'}`}
            type="text"
            placeholder="Last"
            onChange={(e) => setRegisteringUser({ ...registeringUser, lastName: (e.target as HTMLInputElement).value })}
          />
          <br />
          and I want to register my
          <input
            name="locationCategory"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('category') && 'has-error'}`}
            type="text"
            placeholder="Community"
            onFocus={() => setState({ ...state, locationCategoriesOpened: true })}
            readOnly
            value={
              registeringLocation.category
                ? lcTrans(registeringLocation.category)
                : ''
              }
          />
          <br />
          with about
          <input
            name="employeeCount"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('employeeCount') && 'has-error'}`}
            type="number"
            onChange={(e) => setRegisteringLocation({ ...registeringLocation, employeeCount: parseInt((e.target as HTMLInputElement).value) })}
          />
          {lcPeople(registeringLocation.category || LocationCategories.COMMUNITY)}
          <br />
          located in
          {' '}
          <input
            name="zipCode"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('zipCode') && 'has-error'}`}
            type="text"
            placeholder="Zip Code"
            onChange={(e) => setRegisteringLocation({ ...registeringLocation, zipCode: (e.target as HTMLInputElement).value })}
          />.
        </p>
        <p style={{ textAlign: 'center' }}>
          <img alt="Welcome to Greenlight!" src={welcomeDoctorImage} height="150px" />
        </p>

        <p>
          <Trans id="WelcomePage.terms_and_conditions">
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
              onClick={() => {
                setState({ ...state, showErrors: true })
                if (validateLocation(registeringLocation).length !== 0 || validateUser(registeringUser).length !== 0) {
                  logger.dev('Location not validated',
                    validateLocation(registeringLocation),
                    validateUser(registeringUser))
                  return
                }
                setState({ ...state, showErrors: false })
                SessionStorage.setRegisteringUser(registeringUser)
                SessionStorage.setRegisteringLocation(registeringLocation)
                props.f7router.navigate(dynamicPaths.registerLocationMessagePath({
                  messageId: nextMessage(registeringLocation),
                }))
              }}
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
          <iframe src="https://greenlightready.com/terms.html" style={{ width: '100%', border: 0, height: '90%' }} />
        </PageContent>
      </Sheet>

      <Sheet
        opened={state.locationCategoriesOpened}
        onSheetClosed={() => {
          setState({ ...state, locationCategoriesOpened: false })
        }}
      >
        <Toolbar>
          <div className="left" />
          <div className="right">
            <Link sheetClose><Trans id="Common.close">Close</Trans></Link>
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
