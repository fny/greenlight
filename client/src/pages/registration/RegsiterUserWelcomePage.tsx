import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, Link, List, ListItem, Page, PageContent, Row, Sheet, Toolbar,
} from 'framework7-react'
import React, { useState } from 'react'
import { isBlank, isPresent, upperCaseFirst } from 'src/helpers/util'
import { GRegisteringLocation, GRegisteringUser, toggleLocale } from 'src/initializers/providers'
import { toggleLocale } from 'src/helpers/global'
import {
  lcTrans, LocationCategories, LOCATION_CATEGORIES,
} from 'src/models/Location'
import welcomeDoctorImage from 'src/assets/images/welcome-doctor.svg'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'

function ResizingInput(props: React.HTMLProps<HTMLInputElement>): JSX.Element {
  const [value, setValue] = useState('')
  return (
    <input
      {...props}
      onChange={(e) => {
        setValue(e.target.value || '')
        props.onChange && props.onChange(e)
      }}
      size={(value ? value.length : props.placeholder?.length || 0) + 4}
    />
  )
}

class State {
  firstName?: string

  lastName?: string

  locationCategoriesOpened = false

  showErrors = false

  termsOpened = false

  locationCategory: LocationCategories | null = null
}

function validateUser(user: GRegisteringUser) {
  const errors = []
  isBlank(user.firstName) && errors.push('firstName')
  isBlank(user.lastName) && errors.push('lastName')
  return errors
}

function validateLocation(location: GRegisteringLocation) {
  const errors = []
  isBlank(location.zipCode) && errors.push('zipCode')
  !/^\d{5}$/.test(location.zipCode) && errors.push('zipCode')
  isBlank(location.category) && errors.push('category')
  return errors
}

export default function RegisterLocationWelcomePage(props: F7Props): JSX.Element {
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const [registeringLocation, setRegisteringLocation] = useGlobal('registeringLocation')
  const [state, setState] = useState(new State())

  return (
    <Page className="RegisterLocationWelcomePage">
      <style>
        {
          `
          .RegisterLocationWelcomePage .fill-in-the-blank {
            display: inline-block;
            border-bottom: 1px dashed black;
            text-align: center;
            color: var(--gl-green);
          }
          .RegisterLocationWelcomePage .category-select {
            cursor: pointer;
          }
          .RegisterLocationWelcomePage .introduction {
            font-size: 1.5rem;
          }
          .RegisterLocationWelcomePage .has-error {
            color: red;
            border-bottom: 1px dashed red;
          }
          .RegisterLocationWelcomePage .has-error::placeholder {
            color: red;
          }
          `
        }
      </style>
      <Block>
        <h1>
          Introduce yourself.
          {' '}
          {/* TODO: Enable Spanish */}
          {/* <Link style={{ fontSize: '12px', paddingLeft: '1rem' }} onClick={() => toggleLocale()}>
            <Trans id="Common.toggle_locale">En Español</Trans>
          </Link> */}
        </h1>
        <p className="introduction">
          Hello, Greenlight!
        </p>
        <p className="introduction">
          My name is
          {' '}
          <ResizingInput
            name="firstName"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('firstName') && 'has-error'}`}
            type="text"
            placeholder="First"
            onChange={(e) => {
              setRegisteringUser({ ...registeringUser, firstName: (e.target as HTMLInputElement).value })
            }}
          />
          {' '}
          <ResizingInput
            name="lastName"
            className={`fill-in-the-blank ${state.showErrors && validateUser(registeringUser).includes('lastName') && 'has-error'}`}
            type="text"
            placeholder="Last"
            onChange={(e) => setRegisteringUser({ ...registeringUser, lastName: (e.target as HTMLInputElement).value })}
          />
          {' '}
          and I want to register my
          <ResizingInput
            name="locationCategory"
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('category') && 'has-error'}`}
            type="text"
            placeholder="Community"
            onFocus={() => setState({ ...state, locationCategoriesOpened: true })}
            value={
              registeringLocation.category
                ? lcTrans(registeringLocation.category)
                : ''
              }
          />
          located in
          <ResizingInput
            className={`fill-in-the-blank ${state.showErrors && validateLocation(registeringLocation).includes('zipCode') && 'has-error'}`}
            type="text"
            placeholder="Zip Code"
            onChange={(e) => setRegisteringLocation({ ...registeringLocation, zipCode: (e.target as HTMLInputElement).value })}
          />
          for Greenlight.
        </p>

        <img alt="Welcome to Greenlight!" src={welcomeDoctorImage} />
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
                  return
                }
                setState({ ...state, showErrors: false })
                props.f7router.navigate(paths.registerLocationOwnerPath)
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
          <iframe src="/terms.html" style={{ width: '100%', border: 0, height: '90%' }} />
        </PageContent>
      </Sheet>

      <Sheet
        opened={state.locationCategoriesOpened}
        onSheetClosed={() => {
          setState({ ...state, locationCategoriesOpened: false })
        }}
        swipeToClose
      >

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
