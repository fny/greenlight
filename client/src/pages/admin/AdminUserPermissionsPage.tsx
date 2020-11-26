import React, {
  useState, useEffect, useGlobal, Children,
} from 'reactn'
import {
  Page, BlockTitle, Badge, Block, Button, Link, Navbar, f7, ListInput, List,
} from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { FunctionComponent, F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/util'

import { Location, User } from 'src/models'
import {
  getLocation, getUser, store, updateLocationAccount,
} from 'src/api'
import SubmissionHandler from 'src/misc/SubmissionHandler'
import { LocationAccount, PermissionLevels } from 'src/models/LocationAccount'
import { dynamicPaths } from 'src/routes'
import LoadingPage from '../LoadingPage'

interface State {
  user?: User | null
  location?: Location | null
  locationAccount?: LocationAccount | null
  permissionLevel: PermissionLevels
}

export default function AdminUserPermissionsPage(props: F7Props) {
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

  if (!state.user || !state.location) {
    return <LoadingPage />
  }

  assertNotNull(state.location)
  assertNotNull(state.locationAccount)
  assertNotNull(state.user)
  assertNotUndefined(state.location)
  assertNotUndefined(state.locationAccount)
  assertNotUndefined(state.user)
  const la = state.locationAccount
  const l = state.location
  const handler = new SubmissionHandler(f7)

  return (
    <Page>
      <Navbar title={`${state.user.firstName}'s Permissions`} />
      <Block>
        <List
          form
          onSubmit={(e) => {
            e.preventDefault()
            handler.onSuccess = () => {
              props.f7router.navigate(dynamicPaths.adminUsersPath({ locationId: l.id }))
            }
            handler.submit(async () => {
              await updateLocationAccount(la, {
                permissionLevel: state.permissionLevel,
              })
            })
          }}
          noHairlines
        >
          <ListInput
            label={t({ id: 'AdminUserPermissionsPage.permission_level', message: 'Permission Level' })}
            type="select"
            value={state.permissionLevel}
            onChange={(e) => setState({ ...state, permissionLevel: e.target.value })}
          >
            <option value={PermissionLevels.NONE}>None</option>
            <option value={PermissionLevels.ADMIN}>Admin</option>
          </ListInput>
          <Button type="submit" fill style={{ marginTop: '1rem' }}>
            Submit
          </Button>
        </List>
      </Block>
    </Page>
  )
}