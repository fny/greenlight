import React, { useEffect, useState } from 'reactn'
import {
  Page, Block, Button, Navbar, f7,
} from 'framework7-react'

import { F7Props } from 'src/types'
import { Location, LocationAccount, User } from 'src/models'
import {
  getLocation, getUser,
} from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { dynamicPaths } from 'src/config/routes'
import { assertNotUndefined, assertNotNull } from 'src/helpers/util'
import LoadingPage from 'src/pages/util/LoadingPage'
import TeacherStaffForm from './TeacherStaffForm'

interface State {
  isLoading: Boolean
  user?: User | null
  location?: Location | null
  locationAccount?: LocationAccount | null
}

export default function AdminUserEditPage(props: F7Props) {
  const { locationId, userId } = props.f7route.params
  assertNotUndefined(locationId)

  const [state, setState] = useState<State>({
    isLoading: true,
  })

  useEffect(() => {
    (async () => {
      const location = await getLocation(locationId)
      let user = null, locationAccount = null
      if (userId) {
        user = await getUser(userId)
        locationAccount = user.accountFor(location)
      }

      setState({
        user,
        location,
        locationAccount,
        isLoading: false,
      })
    })()
  }, [])

  const { user, location, locationAccount, isLoading } = state

  if (isLoading) return <Page><LoadingPage /></Page>

  assertNotUndefined(location)
  assertNotNull(location)

  const handleSuccess = () => {
    props.f7router.navigate(dynamicPaths.adminUsersPath({ locationId: location.id }))
  }

  return (
    <Page>
      <Navbar title={user ? `Edit ${user.firstName}'s Account` : 'Add New User'} />
      <Block>
        <TeacherStaffForm
          user={user}
          location={location}
          locationAccount={locationAccount}
          onSuccess = {handleSuccess}
        />
      </Block>
    </Page>
  )
}
