import { Fragment, useCallback } from 'reactn'
import { Block, Button, Navbar, f7, ListInput, List } from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/helpers/util'

import { Location, User } from 'src/models'
import { getLocation, getUser, store, updateLocationAccount } from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { LocationAccount, PermissionLevels } from 'src/models/LocationAccount'
import { dynamicPaths } from 'src/config/routes'
import LoadingPage from 'src/pages/util/LoadingPage'
import { withAPI, useAPI } from 'src/components/withAPI'

interface State {
  user?: User | null
  location?: Location | null
  locationAccount?: LocationAccount | null
  permissionLevel: PermissionLevels
}

function AdminUserPermissionsContent(props: F7Props) {
  const { data, setData } = useAPI() as { data: State; [i: string]: any }

  // if (!data || !data.user || !data.location) {
  //   return <LoadingPage />
  // }

  assertNotNull(data.location)
  assertNotNull(data.locationAccount)
  assertNotNull(data.user)
  assertNotUndefined(data.location)
  assertNotUndefined(data.locationAccount)
  assertNotUndefined(data.user)
  const la = data.locationAccount
  const l = data.location
  const handler = new SubmitHandler(f7)

  return (
    <Fragment>
      <Navbar title={`${data.user.firstName}'s Permissions`} />
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
                permissionLevel: data.permissionLevel,
              })
            })
          }}
          noHairlines
        >
          <ListInput
            label={t({ id: 'AdminUserPermissionsPage.permission_level', message: 'Permission Level' })}
            type="select"
            value={data.permissionLevel}
            onChange={(e) => setData({ permissionLevel: e.target.value })}
          >
            <option value={PermissionLevels.NONE}>None</option>
            <option value={PermissionLevels.ADMIN}>Admin</option>
          </ListInput>
          <Button type="submit" fill style={{ marginTop: '1rem' }}>
            Submit
          </Button>
        </List>
      </Block>
    </Fragment>
  )
}

const AdminUserPermissions = withAPI<
  {
    fetchData: (...params: any[]) => Promise<any>
    showLoadingOnUpdate?: boolean
  } & F7Props
>(AdminUserPermissionsContent)

export default function AdminUserPermissionsPage(props: F7Props) {
  const fetchData = useCallback(async () => {
    const { locationId, userId } = props.f7route.params
    assertNotUndefined(locationId)
    assertNotUndefined(userId)

    const [user, location] = await Promise.all([getUser(userId), getLocation(locationId)])
    const locationAccount = user?.accountFor(location)
    return {
      user,
      locationAccount,
      location,
      permissionLevel: locationAccount?.permissionLevel || PermissionLevels.NONE,
    }
  }, [props])

  return <AdminUserPermissions fetchData={fetchData} {...props} />
}
