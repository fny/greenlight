import React, {
  useState, useEffect,
} from 'reactn'
import {
  Page, Block, Button, Navbar, NavRight, f7, ListInput, List, ListItem, ListButton, Link, Icon, Checkbox,
} from 'framework7-react'
import { Trans, t } from '@lingui/macro'

import { F7Props } from 'src/types'
import { assertNotNull, assertNotUndefined, formatPhone } from 'src/helpers/util'

import { Location, User } from 'src/models'
import {
  getLocation, getUser, store, updateLocationAccount, deleteLocationAccount, deleteUser,
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
  shouldDeleteChildren: boolean
}

export default function AdminUserPage(props: F7Props): JSX.Element {
  const { locationId, userId } = props.f7route.params
  assertNotUndefined(locationId)
  assertNotUndefined(userId)

  const [state, setState] = useState<State>({
    permissionLevel: PermissionLevels.NONE,
    shouldDeleteChildren: false,
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
        shouldDeleteChildren: false,
      })
    })()
  }, [])

  // assertNotNull(state.location)
  // assertNotNull(state.locationAccount)
  // assertNotNull(state.user)
  // assertNotUndefined(state.location)
  // assertNotUndefined(state.locationAccount)
  // assertNotUndefined(state.user)
  const { user, locationAccount, location, shouldDeleteChildren } = state
  const unlinkHandler = new SubmitHandler(f7)
  const deleteHandler = new SubmitHandler(f7)

  const handleDeleteAttempt = () => {
    f7.dialog.confirm(
      t({
        id: shouldDeleteChildren ? 'AdminUserPage.delete_with_children_caution' : 'AdminUserPage.delete_caution',
        message: shouldDeleteChildren ?
          "Are you sure to delete this user? The children of this user will also be deleted.":
          "Are you sure to delete this user?",
      }),
      t({ id: 'AdminUserPage.delete', message: 'Delete' }),
      () => {
        deleteHandler.submit()
      },
    )
  }

  const handleUnlinkAttempt = () => {
    f7.dialog.confirm(
      t({
        id: 'AdminUserPage.unlink_caution',
        message: "Are you sure to unlink this user from the location?"
      }),
      t({ id: 'AdminUserPage.unlink', message: 'Unlink' }),
      () => {
        unlinkHandler.submit()
      },
    )
  }

  deleteHandler.onSubmit = async () => {
    assertNotNull(user)
    assertNotUndefined(user)
    assertNotNull(location)
    assertNotUndefined(location)

    await deleteUser(user, location, shouldDeleteChildren)
  }
  deleteHandler.onSuccess = () => {
    props.f7router.navigate(dynamicPaths.adminUsersPath({ locationId }))
  }

  unlinkHandler.onSubmit = async () => {
    assertNotNull(locationAccount)
    assertNotUndefined(locationAccount)

    await deleteLocationAccount(locationAccount)
  }
  unlinkHandler.onSuccess = () => {
    props.f7router.navigate(dynamicPaths.adminUsersPath({ locationId }))
  }

  let content
  if (!user || !location || !locationAccount) {
    content = <LoadingPage />
  } else {
    content = (
      <>
        <Navbar title={`${user.firstName} ${user.lastName}`}>
          {(locationAccount.role === 'teacher' ||
            locationAccount.role === 'staff') &&
            (
              <NavRight>
                <Link href={dynamicPaths.adminUserEditPath({ locationId: location.id, userId: user.id })}>
                  <Icon f7="pencil_circle" />
                </Link>
              </NavRight>
            )}          
        </Navbar>
        <Block>
          <p>
            {user.firstName} {user.lastName} is a {locationAccount.role} at {location.name}
          </p>
          {user.firstName === 'Aidan'
          && (
          <>
            <p>{user.firstName} is in the following Cohorts</p>
            <ul>
              <li>Homeroom: Verdell, Lucy</li>
              <li>Bus Route: 711, 811</li>
            </ul>
          </>
          )}

          <List>
            {user.mobileNumber && (
            <ListItem
              external
              link={`tel:${user.mobileNumber}`}
              title={`Call ${user.firstName}: ${user.mobileNumber}`}
            />
            )}
            {
          user.email && (
          <ListItem
            external
            link={`mailto:${user.email}`}
            title={`Email ${user.firstName}: ${user.email}`}
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

        <Block>
          <List>
            <ListButton onClick={handleUnlinkAttempt} color="red">
              <Trans id="AdminUserPage.unlink">Unlink</Trans>
            </ListButton>
          </List>
        </Block>

        <Block>
          <List>
          {(locationAccount.role === 'teacher' ||
            locationAccount.role === 'staff') ? (
              <ListItem
                checkbox
                checked={shouldDeleteChildren}
                onChange={(e) => setState({ ...state, shouldDeleteChildren: e.target.checked })}
                title={t({ id: 'AdminUserPage.with_children', message: 'Together with Children' })}
              >
                <Button slot="after" color="red" onClick={handleDeleteAttempt}>
                  <Trans id="AdminUserPage.delete">Delete</Trans>
                </Button>
              </ListItem>
            ) : (
              <ListButton onClick={handleDeleteAttempt} color="red">
                <Trans id="AdminUserPage.delete">Delete</Trans>
              </ListButton>
            )}            
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
