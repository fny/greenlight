import {
  Badge, Block, BlockTitle, Button, f7, List, ListInput, Page,
} from 'framework7-react'
import React, { useMemo, useState } from 'react'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { F7Props } from 'src/types'
import { Location } from 'src/models'
import { Router } from 'framework7/modules/router/router'
import { dynamicPaths } from 'src/config/routes'

export default function LocationLookupRegistrationCodePage({ f7route, f7router }: F7Props): JSX.Element {
  const { locationId } = f7route.params
  assertNotUndefined(locationId)

  return (
    <Page>
      <LoadingLocationContent
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)

          return (
            <Block>
              <BlockTitle medium className="title">
                <b>{location.name}</b>
                <Badge className="title-badge">
                  {location.category}
                </Badge>
              </BlockTitle>
              <RegisterWithCode location={location} f7router={f7router} />
            </Block>
          )
        }}
      />
    </Page>
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
        f7router.navigate(`/go/${location.id}/code/${registrationCode}`)
      }}
    >
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
      <Button fill href={dynamicPaths.locationCheckRegistrationCodePath({ locationId: location.id, registrationCode })}>
        Register with Code
      </Button>
    </List>
  )
}
