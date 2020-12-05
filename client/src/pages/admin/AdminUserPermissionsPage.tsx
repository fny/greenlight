import React, {
  useState, useEffect,
} from 'reactn'
import {
  Page, Block, Button, Navbar, f7, ListInput, List,
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
  const handler = new SubmitHandler(f7)

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
