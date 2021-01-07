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
  getLocation, getUser, store, updateLocationAccount, requestPeopleReport,
} from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { LocationAccount, PermissionLevels } from 'src/models/LocationAccount'
import { dynamicPaths, paths } from 'src/config/routes'
import LoadingPage from 'src/pages/util/LoadingPage'

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

  const reportHandler = new SubmitHandler(f7, {
    onSubmit: async () => {
      await requestPeopleReport(l)
    },
    errorTitle: t({ id: 'Common.failed', message: 'Action Failed' }),
    submittingMessage: t({ id: 'Location.requesting_report', message: 'Requesting Report...' }),
    successMessage: t({ id: 'Location.request_report_success', message: 'The generated report will be sent to your email.' }),
  })

  return (
    <Page>
      <Navbar title={`${state.user.firstName}'s Permissions`} />
      <Block>
        <List
          form
          noHairlines
        >
          <p>
            You are linked to {l.name}.
            You can invite other people to link to this location by using this URL:
            {la.isOwner()
              ? 'You are listed as an owner.'
              : la.isAdmin()
                ? 'You are listed as an admin.'
                : ''}
          </p>
          <p>
            <Link href="#">{l.registrationWithCodeURL()}</Link>
          </p>
          {l.permalink === 'greenlight'
          && (
          <ListItem
            title="Cohorts"
            smartSelect
            smartSelectParams={{ searchbar: true, searchbarPlaceholder: 'Search Cohorts' }}
          >
            <select name="cohort" multiple defaultValue={['honda', 'audi', 'ford']}>
              <optgroup label="Bus Route">
                <option value="honda">A</option>
                <option value="lexus">B</option>
                <option value="mazda">C</option>
                <option value="nissan">D</option>
                <option value="toyota">E</option>
              </optgroup>
              <optgroup label="Building">
                <option value="audi">Middle</option>
                <option value="bmw">High</option>
                <option value="mercedes">Gym</option>
              </optgroup>
              <optgroup label="Homeroom">
                <option value="cadillac">Cassidy</option>
                <option value="chrysler">Daniels</option>
                <option value="dodge">Ford</option>
                <option value="ford">Zimmerman</option>
              </optgroup>
            </select>
          </ListItem>
          )}

          {la.isAdmin()
          && (
            <p>
              <Button fill onClick={() => reportHandler.submit()}>
                <Trans id="Location.request_report">
                  Request Report
                </Trans>
              </Button>
            </p>
          )}
        </List>
      </Block>
    </Page>
  )
}
