import { Badge, Block, BlockTitle, Button, f7, List, ListInput, Page } from 'framework7-react'
import React, { useMemo, useState } from 'react'
import { mailInvite } from 'src/api'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { F7Props } from 'src/types'

export default function LocationLookupAccountPage({ f7route, f7router }: F7Props) {
  const { locationId } = f7route.params
  assertNotUndefined(locationId)

  return (
    <Page>
      <LoadingLocationContent
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)
          assertNotUndefined(location)

          return (
            <Block>
              <BlockTitle medium className="title">
                <b>{location.name}</b>
                <Badge className="title-badge">
                  {location.category}
                  </Badge>
              </BlockTitle>
              <p>
                If you have a Hotmail, MSN, Live, Outlook or other Microsoft email account
                and don't receive an invite, please contact us at{' '}
                <a href="mailto:help@greenlightready.com">help@greenlightready.com</a>.
              </p>
              <LookupAccount />
            </Block>
          )
        }
      }
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
        Lookup Account
      </Button>
    </List>
  )
}
