import React, { useState, useEffect } from 'reactn'
import {
  Page, Navbar, BlockTitle, Badge, Block, Button, Preloader, Link,
} from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { FunctionComponent, F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/util'
import { paths } from 'src/routes'

import './LocationPage.css'
import { Location } from 'src/models'
import { getLocation } from 'src/api'
import LoadingPage from './LoadingPage'

const LocationPage: FunctionComponent<F7Props> = ({ f7route, f7router }) => {
  const { locationId } = f7route.params
  assertNotUndefined(locationId)

  const [location, setLocation] = useState<Location | null>()
  const [error, setError] = useState<any>(null)

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
          Something went wrong.
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
          This location will only have access to your status (cleared, pending, recovery) and your COVID test results.
          You can revoke access at any time.
        </p>
        <Button fill>
          <Trans id="Location.register">
            Register
          </Trans>
        </Button>
      </Block>
    </Page>
  )
}

export default LocationPage
