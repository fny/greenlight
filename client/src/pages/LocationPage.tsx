import React, { useState, useEffect, useGlobal } from 'reactn'
import {
  f7, Page, Navbar, BlockTitle, Badge, Block, Button, Preloader, Link,
} from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { reloadCurrentUser } from 'src/initializers/providers'
import { FunctionComponent, F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/util'
import { paths } from 'src/routes'

import './LocationPage.css'
import { Location, LocationAccount } from 'src/models'
import { getLocation, deleteLocationAccount } from 'src/api'
import LoadingPage from './LoadingPage'

const LocationPage: FunctionComponent<F7Props> = ({ f7route, f7router }) => {
  const { locationId } = f7route.params
  const [currentUser] = useGlobal('currentUser')
  assertNotUndefined(locationId)
  assertNotNull(currentUser)

  const [location, setLocation] = useState<Location | null>()
  const [locationAccount, setLocationAccount] = useState<LocationAccount | undefined>()
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    getLocation(locationId).then(setLocation).catch(setError)
  }, [locationId])

  useEffect(() => {
    setLocationAccount(currentUser.laOfLocation(locationId))
  }, [locationId, currentUser])

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

  const handleLeaveAttempt = () => {
    assertNotUndefined(locationAccount)

    f7.dialog.prompt(
      t({
        id: 'Location.leave_caution',
        message: "This will disconnect you from this location permanently, \
        and they will be notified you are leaving. No one there will have \
        access to your data any longer. \
        If you are sure you want to leave type, 'leave'.",
      }),
      (input: string) => {
        if (input.toLowerCase() === 'leave') leave()
      }
    )
  }

  const leave = async () => {
    assertNotUndefined(locationAccount)
    f7.dialog.preloader(t({ id: 'Location.leaving', message: 'Processing...' }))

    try {
      await deleteLocationAccount(locationAccount.id)
      await reloadCurrentUser()
      f7.dialog.close()
    } catch (error) {
      f7.dialog.close()
      f7.dialog.alert(
        t({ id: 'Common.failed', message: 'Action Failed' }),
        t({ id: 'Common.somethings_wrong', message: 'Something went wrong' }),
      )
    }
  }

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
        {!!locationAccount ? (
          <Button fill onClick={handleLeaveAttempt}>
            <Trans id="Location.leave">
              Leave
            </Trans>
          </Button>
        ) : (
          <Button fill>
            <Trans id="Location.register">
              Register
            </Trans>
          </Button>
        )}
      </Block>
    </Page>
  )
}

export default LocationPage
