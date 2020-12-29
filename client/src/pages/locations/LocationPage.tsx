// TODO: I18N
// TODO: UGLY
// TODO: Add link to create account
import React, { useState, useEffect } from 'reactn'
import {
  Page, BlockTitle, Badge, Block, Button, Link, List, ListItem, ListInput, f7,
} from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/helpers/util'
import { paths } from 'src/config/routes'

import './LocationPage.css'
import { Location } from 'src/models'
import { getLocation, mailInvite } from 'src/api'
import LoadingPage from 'src/pages/util/LoadingPage'
import SubmitHandler from 'src/helpers/SubmitHandler'

class State {
  emailOrMobile: string = ''
}

export default function LocationPage({ f7route, f7router }: F7Props): JSX.Element {
  const [location, setLocation] = useState<Location | null>()
  const [error, setError] = useState<any>(null)
  const [state, setState] = useState<State>(new State())

  const { locationId } = f7route.params
  assertNotUndefined(locationId)

  // TODO: Tell them if their account is already active
  // TODO: Show an error specific to email or mobile number
  const submitHandler = new SubmitHandler(f7, {
    onSuccess: () => {
      f7.dialog.alert('You should receive a text or email with instructions from Greenlight soon. Please check spam too! ', 'Success')
    },
    errorTitle: 'Not Found',
    errorMessage: 'No matching email or phone number was found. Maybe you already signed up?',
    onSubmit: async () => {
      await mailInvite(state.emailOrMobile)
    },
  })

  useEffect(() => {
    getLocation(locationId).then(setLocation).catch(setError)
  }, [locationId])

  if (!location && !error) {
    return (
      <LoadingPage />
    )
  }

  if (!location && error) {
    return (
      <Page>
        <Block>
          We couldn't find a location for the ID "{locationId}".
          <br />
          <br />
          <Button href={paths.rootPath} fill>Return to Home Screen</Button>
        </Block>
      </Page>
    )
  }

  assertNotNull(location)
  assertNotUndefined(location)

  return (
    <Page>
      <Block>
        <BlockTitle medium className="title">
          <b>{location.name}</b>
          <Badge className="title-badge">
            {location.category}
          </Badge>
        </BlockTitle>
        <ul>
          {location.website && <li>Website: <Link href={location.website}>{location.website}</Link><br /></li>}
          {location.phoneNumber && <li>Phone Number: <Link href={`tel:${location.phoneNumber}`}>{formatPhone(location.phoneNumber)}</Link></li>}
          {location.email && <li>Email: <Link href={`mailto:${location.email}`}>{location.email}</Link></li>}
        </ul>
        <p>
          By registering, this location will have access to your status (cleared, pending, recovery) and COVID test results you submit.
          You can revoke access at any time.
        </p>
        <p>
          If you have a Hotmail, MSN, Live, Outlook or other Microsoft email account
          and don't receive an invite, please contact us at{' '}
          <a href="mailto:help@greenlightready.com">help@greenlightready.com</a>.
        </p>
        <List
          form
          noHairlines
          onSubmit={(e) => {
            e.preventDefault()

            submitHandler.submit()
          }}
        >
          {/* TODO: Switch to email or mobile input type */}
          <ListInput
            label="Email or Mobile Number"
            placeholder="Your Email or Mobile Number"
            type="text"
            required
            onChange={(e) => { setState({ ...state, emailOrMobile: e.target.value }) }}
          />
          <br />
          <Button fill type="submit">
            <Trans id="LocationPage.claim_account">
              Lookup Account
            </Trans>
          </Button>
        </List>

        {/* <Button outline>
          <Trans id="LocationPage.claim_account">
            Create Account
          </Trans>
        </Button> */}
        <Link href={paths.rootPath}>Return to Home Screen</Link>
      </Block>
    </Page>
  )
}
