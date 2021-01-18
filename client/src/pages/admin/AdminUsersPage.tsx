import { t } from '@lingui/macro'
import {
  AccordionContent, f7, Icon, Link, List, ListGroup, ListItem, Navbar, NavLeft, NavRight, Page, Searchbar, Subnavbar,
} from 'framework7-react'

import {
  getLocation,
  getPagedResources, getPagedUsersForLocation, getUsersForLocation, Filter, PagedResource, Pagination, store,
} from 'src/api'
import { User, Location } from 'src/models'
import { Dict, F7Props } from 'src/types'
import UserJDenticon from 'src/components/UserJDenticon'
import { dynamicPaths, paths } from 'src/config/routes'
import {
  assertNotNull, assertNotUndefined, sortBy, isBlank, stringify,
} from 'src/helpers/util'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import React, { useEffect, useState, useRef } from 'react'
import _, { stubTrue } from 'lodash'
import { useSWRInfinite } from 'swr'

import LoadedContent, { LoadedState } from 'src/components/LoadedContent'
// import { UsersFilter } from 'src/components/UsersFilter'

interface UserItemProps {
  user: User
  location: Location
}
function UserItem(props: UserItemProps & F7Props): JSX.Element {
  const { user, location, f7route } = props
  const locationAccount = user.accountFor(location)
  assertNotNull(locationAccount)

  return (
    <ListItem
      key={user.id}
      accordionItem
      className="user-item"
      link="#"
      title={`${user.reversedName()}${locationAccount.isAdmin() ? ' (Admin)' : ''}`}
      after={user.greenlightStatus().title()}
    >
      <div slot="media">
        <UserJDenticon user={user} alert={!user.completedWelcomeAt.isValid} size={29} key={user.id} />
      </div>
      <AccordionContent key={user.id}>
        <List>
          {
              user.hasNotSubmittedOwnSurvey() ? (
                <ListItem
                  link={dynamicPaths.userSurveysNewPath(user.id, { redirect: f7route.path })}
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
          {/* <ListItem
            link={dynamicPaths.adminUserPath({ userId: user.id, locationId: location.id })}
            title={t({ id: 'AdminUsersPage.user_more', message: 'More' })}
          /> */}
        </List>
      </AccordionContent>
    </ListItem>
  )
}

class State extends LoadedState {
  location: Location | null = null

  usersFilter: Filter = {}

  nameQuery: string = ''
}

function sortUsersByReversedName(users: User[]): User[] {
  return sortBy(users, (u) => u.reversedName().toUpperCase())
}

function groupUsersByFirstLetter(users: User[]): [string, User[]][] {
  const grouped: Dict<User[]> = {}
  for (const user of users) {
    const letter = user.lastName[0].toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(user)
  }
  return Object.entries(grouped)
}

// function transformFilterStrings(filters: string[]) {
//   filters.
// }

export default function AdminUsersPage(props: F7Props): JSX.Element {
  const { locationId } = props.f7route.params
  // const { status } = props.f7route.query
  assertNotUndefined(locationId)

  const location = store.findEntity<Location>(Location.uuid(locationId))
  const [state, setState] = useState({
    ...new State(),
    isLoading: !location,
    location,
  })

  useEffect(() => {
    if (state.location) return
    getLocation(locationId)
      .then((location) => {
        setState({ ...state, location, isLoading: false })
      })
      .catch((error) => {
        setState({ ...state, error, isLoading: false })
      })
  }, [locationId])

  function loadMore() {
    if (!allowInfinite.current) return
    allowInfinite.current = false
    setSize(size + 1).then(() => {
      allowInfinite.current = true
    })
  }

  const allowInfinite = useRef(true)

  const getKey = (pageIndex: number, previousPageData: PagedResource<User> | null) => {
    if (previousPageData && !previousPageData.pagination.next) return null
    const nextPage = pageIndex + 1
    return [locationId, nextPage, JSON.stringify({})]
  }

  const {
    data, error, isValidating, mutate, size, setSize,
  } = useSWRInfinite<PagedResource<User>>(getKey, async (locationId, page, filter) => getPagedUsersForLocation(locationId, page, JSON.parse(filter)))

  const users = sortUsersByReversedName(
    _.uniqBy(data ? data.map((d) => d.data).flat() : [], (u) => u.id),
  )

  const groupedUsers = groupUsersByFirstLetter(users)

  if (error) {
    allowInfinite.current = false
    throw error
  }

  return (
    <Page
      infinite
      infiniteDistance={500}
      infinitePreloader={isValidating}
      onInfinite={error ? undefined : loadMore}
    >
      <LoadedContent
        state={state}
        content={(state) => {
          assertNotNull(state.location)
          const { location } = state
          return (
            <>
              <Navbar title="Users">
                <NavbarHomeLink slot="left" />
                <Subnavbar inner={false}>
                  <Searchbar
                    searchContainer=".search-list"
                    searchIn=".user-item > .item-link > .item-content > .item-inner"
                    searchItem="li.user-item"
                  />
                </Subnavbar>
                <NavRight>
                  <Link onClick={() => window.location.reload()}>
                    <Icon f7="arrow_2_circlepath" />
                  </Link>
                </NavRight>
              </Navbar>
              <List className="searchbar-not-found">
                <ListItem key="blank" title="Nothing found" />
              </List>
              <List className="search-list searchbar-found" contactsList>
                {/* <UsersFilter isSchool={location.isSchool()} /> */}
                {
                  groupedUsers.map(([letter, users]) => (
                    <ListGroup key={letter}>
                      <ListItem key={letter} title={letter} groupTitle />
                      {
                        users.map((user) => <UserItem key={user.id} user={user} location={location} f7route={props.f7route} f7router={props.f7router} />)
                      }
                    </ListGroup>
                  ))
                }
              </List>
            </>
          )
        }}
      />
    </Page>
  )
}
