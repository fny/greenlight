import { t } from '@lingui/macro'
import {
  AccordionContent,
  f7,
  F7Searchbar,
  F7View,
  Icon,
  Link,
  List,
  ListGroup,
  ListItem,
  Navbar,
  NavLeft,
  NavRight,
  Page,
  Searchbar,
  Subnavbar,
} from 'framework7-react'

import {
  getLocation,
  getPagedResources,
  getPagedUsersForLocation,
  getUsersForLocation,
  Filter,
  PagedResource,
  Pagination,
  store,
  deleteLastGreenlightStatus,
} from 'src/api'
import { User, Location, GreenlightStatus } from 'src/models'
import { Dict, F7Props } from 'src/types'
import UserJDenticon from 'src/components/UserJDenticon'
import { dynamicPaths, paths } from 'src/config/routes'
import {
  assertNotNull,
  assertNotUndefined,
  sortBy,
  isBlank,
  stringify,
  isInViewport,
  countVisible,
} from 'src/helpers/util'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import React, { useEffect, useState, useRef, Fragment, useCallback, useMemo } from 'react'
import _, { stubTrue } from 'lodash'
import { useSWRInfinite } from 'swr'

import LoadingContent, { LoadingState } from 'src/components/LoadingContent'
import { GreenlightStatusTypes } from 'src/models/GreenlightStatus'
import { Roles } from 'src/models/LocationAccount'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import { useGlobal } from 'reactn'
import SubmitHandler from 'src/helpers/SubmitHandler'
// import { UsersFilter } from 'src/components/UsersFilter'

interface UserItemProps {
  user: User
  location: Location
  onDeleteGreenlightStatus: () => void
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
      title={`${user.reversedName()} ${locationAccount.role}`}
      after={user.greenlightStatus().title()}
    >
      <div slot="media">
        <UserJDenticon user={user} alert={!user.completedWelcomeAt.isValid} size={29} key={user.id} />
      </div>
      <AccordionContent key={user.id}>
        <List>
          {user.hasNotSubmittedOwnSurvey() ? (
            <ListItem link={dynamicPaths.userSurveysNewPath(user.id, { redirect: f7route.path })} title="Check-In" />
          ) : (
            <Fragment>
              <ListItem
                title={t({
                  id: 'DashboardPage.delete_last_greenlight_status',
                  message: 'Delete last Greenlight Status',
                })}
                onClick={(e) => {
                  e.preventDefault()
                  props.onDeleteGreenlightStatus()
                }}
              />
              <ListItem
                link={dynamicPaths.userGreenlightPassPath(user.id)}
                title={t({ id: 'DashboardPage.greenlight_pass', message: 'Greenlight Pass' })}
              />
            </Fragment>
          )}
          {!locationAccount.isStudent() && (
            <ListItem
              link={dynamicPaths.userLocationPermissionsPath({ userId: user.id, locationId: location.id })}
              title={t({ id: 'AdminUsersPage.location_permissions', message: 'Permissions' })}
            />
          )}
          {/* <ListItem
            link={dynamicPaths.adminUserPath({ userId: user.id, locationId: location.id })}
            title={t({ id: 'AdminUsersPage.user_more', message: 'More' })}
          /> */}
        </List>
      </AccordionContent>
    </ListItem>
  )
}

class State extends LoadingState {
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

function countVisibleUserItems() {
  return countVisible('.user-item')
}

export default function AdminUsersPage(props: F7Props): JSX.Element {
  const { locationId } = props.f7route.params
  assertNotUndefined(locationId)
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  const location = store.findEntity<Location>(Location.uuid(locationId))
  const [state, setState] = useState({
    ...new State(),
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

  const submitHandler = useMemo(
    () =>
      new SubmitHandler(f7, {
        successMessage: 'The status has been deleted successfully.',
        errorTitle: 'Something went wrong',
        errorMessage: 'Deleting the last greenlight status is failed.',
      }),
    [],
  )

  const handleDeleteGreenlightStatus = useCallback((user: User) => {
    submitHandler.submit(async () => {
      await deleteLastGreenlightStatus(user)
    })
  }, [])

  const allowInfinite = useRef(true)

  function getKey(
    pageIndex: number,
    previousPageData: PagedResource<User> | null,
  ): [string, number, string?, GreenlightStatusTypes?, Roles?] | null {
    if (previousPageData && !previousPageData.pagination.next) return null
    const nextPage = pageIndex + 1
    // locationId, page, name?, status?, role?
    assertNotUndefined(locationId)
    return [locationId, nextPage, undefined, GreenlightStatusTypes.CLEARED, undefined]
  }

  const { data, error, isValidating, mutate, size, setSize } = useSWRInfinite<PagedResource<User>>(
    getKey,
    async (locationid: string, page: number, name?: string, status?: GreenlightStatusTypes, role?: Roles) =>
      getPagedUsersForLocation(locationid, page, name, status, role),
  )

  const users = sortUsersByReversedName(_.uniqBy(data ? data.map((d) => d.data).flat() : [], (u) => u.id))

  const groupedUsers = groupUsersByFirstLetter(users)

  function loadMore() {
    if (!allowInfinite.current) return
    allowInfinite.current = false
    setSize(size + 1).then(() => {
      allowInfinite.current = true
    })
  }

  if (error) {
    allowInfinite.current = false
    throw error
  }
  interface F7SearchbarExtended extends F7Searchbar {
    el: HTMLFormElement
    foundEl: HTMLDivElement
    inputEl: HTMLInputElement
    value: string
    query: string
    prevQuery: string
    view: F7View
    searchContainer: HTMLDivElement
  }
  return (
    <Page infinite infiniteDistance={500} infinitePreloader={isValidating} onInfinite={error ? undefined : loadMore}>
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
      <LoadingLocationContent
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)
          return (
            <>
              <List className="searchbar-not-found">
                <ListItem key="blank" title="Nothing found" />
              </List>
              <List className="search-list searchbar-found" contactsList>
                {/* <UsersFilter isSchool={location.isSchool()} /> */}
                {groupedUsers.map(([letter, users]) => (
                  <ListGroup key={letter}>
                    <ListItem key={letter} title={letter} groupTitle />
                    {users.map((user) => (
                      <UserItem
                        key={user.id}
                        user={user}
                        location={location}
                        onDeleteGreenlightStatus={() => handleDeleteGreenlightStatus(user)}
                        f7route={props.f7route}
                        f7router={props.f7router}
                      />
                    ))}
                  </ListGroup>
                ))}
              </List>
            </>
          )
        }}
      />
    </Page>
  )
}
