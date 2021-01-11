import React, {
  useState, useEffect,
} from 'reactn'
import {
  Page, Block, Button, Navbar, f7, ListInput, List, ListItem,
} from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/helpers/util'

import { Location, User } from 'src/models'
import {
  getLocation, getUser, store, updateLocationAccount,
} from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { LocationAccount, PermissionLevels } from 'src/models/LocationAccount'
import { dynamicPaths } from 'src/config/routes'
import LoadingPage from 'src/pages/util/LoadingPage'

interface State {
  user?: User | null
  location?: Location | null
  locationAccount?: LocationAccount | null
  permissionLevel: PermissionLevels
}

export default function AdminUserPage(props: F7Props) {
  const { locationId, userId } = props.f7route.params
  assertNotUndefined(locationId)
  assertNotUndefined(userId)

  const [state, setState] = useState<State>({
    permissionLevel: PermissionLevels.NONE,
  })

  useEffect(() => {
    (async () => {
      const [user, location] = await Promise.all([getUser(userId), getLocation(locationId)])
      const locationAccount = user?.accountFor(location)
      setState({
        user,
        locationAccount,
        location,
        permissionLevel: locationAccount?.permissionLevel || PermissionLevels.NONE,
      })
    })()
  }, [])

  assertNotNull(state.location)
  assertNotNull(state.locationAccount)
  assertNotNull(state.user)
  assertNotUndefined(state.location)
  assertNotUndefined(state.locationAccount)
  assertNotUndefined(state.user)
  const { user, locationAccount, location } = state
  const handler = new SubmitHandler(f7)

  let content
  if (!state.user || !state.location) {
    content = <LoadingPage />
  } else {
    content = (
      <>
        <Navbar title={`${state.user.firstName} ${state.user.lastName}`} />
        <Block>
          <p>
            {state.user.firstName} {state.user.lastName} is a {locationAccount.role} at {location.name}
          </p>
          {state.user.firstName === 'Aidan'
          && (
          <>
            <p>{state.user.firstName} is in the following Cohorts</p>
            <ul>
              <li>Homeroom: Verdell, Lucy</li>
              <li>Bus Route: 711, 811</li>
            </ul>
          </>
          )}

          <List>
            {state.user.mobileNumber && (
            <ListItem
              external
              link={`tel:${state.user.mobileNumber}`}
              title={`Call ${state.user.firstName}: ${state.user.mobileNumber}`}
            />
            )}
            {
          state.user.email && (
          <ListItem
            external
            link={`mailto:${state.user.email}`}
            title={`Email ${state.user.firstName}: ${state.user.email}`}
          />
          )
          }
            {locationAccount.isStudent()
            && user.parents.map((parent) => (
              <ListItem
                external
                link={`mailto:${parent.email}`}
                title={`Email Parent ${parent.firstName}`}
                footer={`${parent.email}`}
              />
            ),

              // { parent.mobileNumber && (
              //   <ListItem
              //     external
              //     link={`tel:${parent.mobileNumber}`}
              //     title={`Call Parent ${parent.firstName}: ${parent.mobileNumber}`}
              //   />
              // ) }
            )}
            {
              user.hasNotSubmittedOwnSurvey() ? (
                <ListItem
                  link={dynamicPaths.userSurveysNewPath(user.id, { redirect: props.f7route.path })}
                  title="Check-In"
                />
              ) : (
                <ListItem
                  link={dynamicPaths.userGreenlightPassPath(user.id)}
                  title={t({ id: 'DashboardPage.greenlight_pass', message: 'Greenlight Pass' })}
                />
              )
            }
            {
              !locationAccount.isStudent() && (
              <ListItem
                link={dynamicPaths.userLocationPermissionsPath({ userId: user.id, locationId: location.id })}
                title={t({ id: 'AdminUsersPage.location_permissions', message: 'Permissions' })}
              />
              )
            }
          </List>
        </Block>
      </>
    )
  }

  return (
    <Page>
      {content}
    </Page>
  )
}
