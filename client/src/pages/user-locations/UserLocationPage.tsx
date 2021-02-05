import React, {
  useState, useEffect,
} from 'reactn'
import {
  Page, Block, Button, Navbar, f7, ListInput, List, Link, ListItem,
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
import { dynamicPaths, paths } from 'src/config/routes'
import LoadingPage from 'src/pages/util/LoadingPage'
import LoadingPageContent from 'src/components/LoadingPageContent'
import EmailSupportLink from 'src/components/EmailSupportLink'

interface State {
  user?: User | null
  location?: Location | null
  locationAccount?: LocationAccount | null
  permissionLevel: PermissionLevels
}

export default function UserLocationPage(props: F7Props) {
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

  let content

  if (!state.user || !state.location) {
    content = <LoadingPageContent />
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

  content = (
    <>
      <Navbar title={`${state.user.firstName}'s Account`} />
      <Block>
        <List
          form
          noHairlines
        >
          <p>
            You are linked to {l.name}. To request removal, please contact <EmailSupportLink />.
          </p>
        </List>
      </Block>
    </>
  )
  return (
    <Page>
      {content}
    </Page>
  )
}
