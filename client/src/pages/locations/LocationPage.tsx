// TODO: I18N
// TODO: UGLY
// TODO: Add link to create account
import React, { useState, useEffect, useMemo } from 'reactn'
import { Page, BlockTitle, Badge, Block, Button, Link, List, ListItem, ListInput, f7 } from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/helpers/util'
import { paths } from 'src/config/routes'

import './LocationPage.css'
import { Location } from 'src/models'
import { mailInvite, checkLocationRegistrationCode } from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import LoadingPageContent from 'src/components/LoadingPageContent'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import { Router } from 'framework7/modules/router/router'

export default function LocationPage({ f7route, f7router }: F7Props): JSX.Element {
  const { locationId } = f7route.params
  assertNotUndefined(locationId)

  return (
    <Page>
      <LoadingLocationContent
        locationId={locationId}
        content={(state) => {
          const { location } = state
          console.log('location', location)
          assertNotNull(location)
          assertNotUndefined(location)

          return (
            <Block>
              <BlockTitle medium className="title">
                <b>{location.name}</b>
                <Badge className="title-badge">{location.category}</Badge>
              </BlockTitle>
              <ul>
                {location.website && (
                  <li>
                    Website: <Link href={location.website}>{location.website}</Link>
                    <br />
                  </li>
                )}
                {location.phoneNumber && (
                  <li>
                    Phone Number: <Link href={`tel:${location.phoneNumber}`}>{formatPhone(location.phoneNumber)}</Link>
                  </li>
                )}
                {location.email && (
                  <li>
                    Email: <Link href={`mailto:${location.email}`}>{location.email}</Link>
                  </li>
                )}
              </ul>
              <p>Greenlight provides daily symptom monitoring for {location.name}.</p>
              <p>
                By registering, this location will have access to health statuses (cleared, pending, recovery), COVID
                test results you submit, and vaccination status. You can revoke access at any time.
              </p>
              <p>
                If you have a Hotmail, MSN, Live, Outlook or other Microsoft email account and don't receive an invite,
                please contact us at <a href="mailto:help@greenlightready.com">help@greenlightready.com</a>.
              </p>

              <LookupAccount />

              <RegisterWithCode location={location} f7router={f7router} />

              <Link href={paths.rootPath}>Return to Home Screen</Link>
            </Block>
          )
        }}
      />
    </Page>
  )
}

function LookupAccount(): JSX.Element {
  const [emailOrMobile, setEmailOrMobile] = useState<string>('')

  // TODO: Tell them if their account is already active
  // TODO: Show an error specific to email or mobile number
  const submitHandler = useMemo(
    () =>
      new SubmitHandler(f7, {
        onSuccess: () => {
          f7.dialog.alert(
            'You should receive a text or email with instructions from Greenlight soon. Please check spam too! ',
            'Success',
          )
        },
        errorTitle: 'Not Found',
        errorMessage: 'No matching email or phone number was found. Maybe you already signed up?',
        onSubmit: async () => {
          await mailInvite(emailOrMobile)
        },
      }),
    [emailOrMobile],
  )

  return (
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
        onChange={(e) => {
          setEmailOrMobile(e.target.value)
        }}
      />
      <br />
      <Button fill type="submit">
        <Trans id="LocationPage.claim_account">Lookup Account</Trans>
      </Button>
    </List>
  )
}

function RegisterWithCode({ location, f7router }: { location: Location; f7router: Router.Router }): JSX.Element {
  const [registrationCode, setRegistrationCode] = useState<string>('')

  return (
    <List
      form
      noHairlines
      onSubmit={(e) => {
        e.preventDefault()

        f7router.navigate(`/l/${location.id}/code/${registrationCode}`)
      }}
    >
      {/* TODO: Switch to email or mobile input type */}
      <ListInput
        label="Registration Code"
        placeholder="Your Registration Code"
        type="text"
        required
        onChange={(e) => {
          setRegistrationCode(e.target.value)
        }}
      />
      <br />
      <Button fill type="submit">
        <Trans id="LocationPage.register_account">Register with code</Trans>
      </Button>
    </List>
  )
}
