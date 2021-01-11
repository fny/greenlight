import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, f7, Link, List, ListItem, Page, PageContent, Row, Sheet, Toolbar,
} from 'framework7-react'
import React, { useState } from 'react'
import {
  isBlank, titleCase, upperCaseFirst,
} from 'src/helpers/util'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import {
  lcPeople, lcTrans, LocationCategories, LOCATION_CATEGORIES,
} from 'src/models/Location'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import SessionStorage from 'src/helpers/SessionStorage'
import { User } from 'src/models'

import './RegisterLocationPages.css'
import logger from 'src/helpers/logger'
import { getEmailTaken } from 'src/api'
import GLPhoneNumber from 'src/helpers/GLPhoneNumber'
import Framework7 from 'framework7'
import { Router } from 'framework7/modules/router/router'

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
  f7.dialog.preloader(t({ id: 'RegisterLocationIntroductionPage.checking_email', message: 'Validating your email...' }))
  let emailTaken
  try {
    emailTaken = await getEmailTaken(registeringUser.email)
  } catch (e) {
    f7.dialog.close()
    f7.dialog.alert(
      t({ id: 'RegisterLocationIntroductionPage.email_check_error', message: "Couldn't connect to Greenlight to validate your email address." }),
      t({ id: 'Common.submission_failed', message: 'Submission Failed' }),
    )
    return
  }
  f7.dialog.close()
  setState({
    ...state, emailTaken,
  })

  if (emailTaken) {
    f7.dialog.alert(
      t({ id: 'RegisterLocationIntroductionPage.email_taken_message', message: 'That email address is already in use. Please sign in to register a new location.' }),
      t({ id: 'Common.email_taken_title', message: 'Email Taken' }),
    )
    return
  }
  SessionStorage.setRegisteringUser(registeringUser)
  SessionStorage.setRegisteringLocation(registeringLocation)
  f7router.navigate(paths.registerLocationMessagePath)
}

export default function RegisterLocationIntroductionPage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const [registeringLocation, setRegisteringLocation] = useGlobal('registeringLocation')
  const [state, setState] = useState(new State())
  logger.dev(registeringUser)
  logger.dev(registeringLocation)
  return (
    <Page className="RegisterLocationPages">
      <Block>
        <h1>
          {
            currentUser
              ? (
                <Trans id="RegisterLocationIntroductionPage.0_introduce_location">
                  Tell us about your community.
                </Trans>
              )
              : (
                <Trans id="RegisterLocationIntroductionPage.0_introduce_yourself">
                  Introduce yourself!
                </Trans>
              )
          }

          {' '}
          <Link
            style={{ fontSize: '12px', paddingLeft: '1rem', textAlign: 'right' }}
            onClick={() => {
              SessionStorage.deleteRegisteringLocation()
              SessionStorage.deleteRegisteringUser()
              setRegisteringLocation(new RegisteringLocation())
              setRegisteringUser(new RegisteringUser())
            }}
          >
            <Trans id="Common.clear">Clear</Trans>
          </Link>
        </h1>

        {state.emailTaken && (
        <p className="error">
          The email listed is already in use. Please <a href={paths.signInPath}>sign in first</a> and then register a new organization.
        </p>
        )}

        <p className={`introduction ${currentUser ? 'hide' : ''}`}>
          <Trans id="RegisterLocationIntroductionPage.1_hello_my_name_is">
            Hello, Greenlight! My name is
          </Trans>
          <br />
          <input
            name="firstName"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('firstName') && 'has-error'}`}
            type="text"
            placeholder={t({ id: 'Common.first_name_short', message: 'First' })}
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
            placeholder={t({ id: 'Common.last_name_short', message: 'Last' })}
            onChange={(e) => setRegisteringUser({ ...registeringUser, lastName: (e.target as HTMLInputElement).value })}
          />,
          <br />
          and my email is
          <input
            name="email"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('email') && 'has-error'}`}
            type="email"
            placeholder={titleCase(t({ id: 'Common.email', message: 'email' }))}
            value={registeringUser.email}
            onChange={(e) => setRegisteringUser({ ...registeringUser, email: (e.target as HTMLInputElement).value })}
          />.
        </p>

        <p className="introduction">
          <Trans id="RegisterLocationIntroductionPage.2_and_i_want_to_register_my">
            I want to register my
          </Trans>
          <input
            name="locationCategory"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('category') && 'has-error'}`}
            type="text"
            placeholder="Community"
            onFocus={() => setState({ ...state, locationCategoriesOpened: true })}
            readOnly
            value={registeringLocation.category ? lcTrans(registeringLocation.category) : ''}
          />
          <br />
          called
          <input
            name="locationName"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('locationName') && 'has-error'}`}
            type="text"
            placeholder="Name"
            value={registeringLocation.name}
            onChange={(e) => setRegisteringLocation({ ...registeringLocation, name: (e.target as HTMLInputElement).value })}
          />
          <br />
          <Trans id="RegisterLocationIntroductionPage.3_with_about">
            with about
          </Trans>
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
          <Trans id="RegisterLocationIntroductionPage.4_located_in">
            located in
          </Trans>
          {' '}
          <input
            name="zipCode"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('zipCode') && 'has-error'}`}
            type="text"
            placeholder={t({ id: 'Common.zip_code', message: 'Zip Code' })}
            value={registeringLocation.zipCode}
            onChange={(e) => setRegisteringLocation({ ...registeringLocation, zipCode: (e.target as HTMLInputElement).value })}
          />.
        </p>
      </Block>

      <Block>
        <Row tag="p">
          <Col tag="span">
            <Button href={paths.registerLocationWelcomePath}>
              <Trans id="Common.back">Back</Trans>
            </Button>
          </Col>
          <Col tag="span">
            <Button
              fill
              onClick={() => submit(f7, props.f7router, state, setState, registeringUser, registeringLocation)}
            >
              <Trans id="Common.continue">Continue</Trans>
            </Button>
          </Col>
        </Row>
      </Block>

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
