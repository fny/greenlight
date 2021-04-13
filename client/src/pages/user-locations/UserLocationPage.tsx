import React, {
  useState, useEffect,
} from 'reactn'
import {
  Page, Block, Button, Navbar, f7, ListInput, List, Link, ListItem,
} from 'framework7-react'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/helpers/util'

import { Location, User } from 'src/models'
import {
  getLocation, getUser, store, updateLocationAccount,
} from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { LocationAccount, PermissionLevels } from 'src/models/LocationAccount'
import { dynamicPaths, paths } from 'src/config/routes'
import LoadingPage from 'src/pages/util/LoadingPage'
import LoadingPageContent from 'src/components/LoadingPageContent'
import EmailSupportLink from 'src/components/EmailSupportLink'
import { currentUser } from 'src/initializers/providers'

interface State {
  user?: User | null
  location?: Location | null
  locationAccount?: LocationAccount | null
  permissionLevel: PermissionLevels
}

export default function UserLocationPage(props: F7Props) {
  const { locationId, userId } = props.f7route.params
  const currUser = currentUser()
  assertNotNull(currUser)

  const location = currUser.affiliatedLocations().filter((l) => l.id.toString() === locationId)[0]
  const isOwnLocation = currUser.locationAccounts.some((la) => la.locationId?.toString() === locationId)
  const ownLocationAccount = currUser.locationAccounts.filter((la) => la.locationId?.toString() === locationId)[0]
  const childrenWithLocation = currUser.children.filter((c) => c.locationAccounts.some((la) => la.locationId?.toString() === locationId))
  const isChildLocation = childrenWithLocation.length > 0
  console.log(location)
  return (
    <Page>
      <Navbar title={location.name || ''} backLink />
      {
        isOwnLocation && (
        <Block>
          <p>You have an account with {location.name}.
            You are listed as a {ownLocationAccount.role} and your permission level is {ownLocationAccount.permissionLevel}.
          </p>

          <p>To invite someone else to join {location.name} as a staff member, give them the following information to use when joining:</p>
          <ul>
            <li>Location ID: {location.permalink}</li>
            <li>Registration Code: {location.registrationCode}</li>
          </ul>

          {
            location.isSchool() && (
            <>
              <p>To invite someone else to register {location.name} as a parent, give them the following information to use when joining:</p>
              <ul>
                <li>Location ID: {location.permalink}</li>
                <li>Parent Registration Code: {location.studentRegistrationCode}</li>
              </ul>
            </>
            )
          }
          {
            isChildLocation && (
            <p>
              The following children also have an account with account with {location.name}: {childrenWithLocation.map((c) => c.firstName).join(', ')}.
            </p>
            )
          }
        </Block>
        )
      }

      {
        !isOwnLocation && isChildLocation && (
        <Block>
          <p>The following children have an account with account with {location.name}: {childrenWithLocation.map((c) => c.firstName).join(', ')}.</p>

          {
            location.isSchool() && (
            <>
              <p>To invite someone else to register {location.name} as a parent, give them the following information to use when joining:</p>
              <ul>
                <li>Location ID: {location.permalink}</li>
                <li>Parent Registration Code: {location.studentRegistrationCode}</li>
              </ul>
            </>
            )
          }
        </Block>
        )
      }
    </Page>
  )
}
