import { t } from '@lingui/macro'
import {
  AccordionContent, f7, Icon, Link, List, ListGroup, ListItem, Navbar, NavLeft, NavRight, Page, Searchbar, Subnavbar,
} from 'framework7-react'
import React, {
  getGlobal, useGlobal, useLayoutEffect, useRef,
} from 'reactn'
import { ReactNComponent } from 'reactn/build/components'
import {
  getPagedResources, getUsersForLocation, Pagination, store,
} from 'src/api'
import { User, Location } from 'src/models'
import { Dict, F7Props } from 'src/types'
import UserJDenticon from 'src/components/UserJDenticon'
import { dynamicPaths, paths } from 'src/config/routes'
import {
  assertNotNull, assertNotUndefined, sortBy, debounce, isBlank,
} from 'src/helpers/util'
import { NoCurrentUserError } from 'src/helpers/errors'
import { Router } from 'framework7/modules/router/router'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { useCallback, useState } from 'react'
import _ from 'lodash'

function useDebounce(callback: any, delay: number) {
  const debouncedFn = useCallback(
    debounce((...args) => callback(...args), delay),
    [delay], // will recreate if delay changes
  )
  return debouncedFn
}

function groupByLetter(users: User[]) {
  const grouped: Dict<User[]> = {}
  for (const user of users) {
    const letter = user.lastName[0].toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(user)
  }
  return grouped
}

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
          <ListItem
            link={dynamicPaths.adminUserPath({ userId: user.id, locationId: location.id })}
            title={t({ id: 'AdminUsersPage.user_more', message: 'More' })}
          />
        </List>
      </AccordionContent>
    </ListItem>
  )
}

class State {
  query: string = ''

  users: User[] = []

  showPreloader = true

  isLoaded = false

  pageState: Pagination = {
    next: 0,
    last: 0,
    current: 0,
    count: 0,
  }

  queryStore = new QueryStore()
}

interface Query {
  nameSearch?: string
  cohortFilters?: string[]
}

class QueryStore {
  _store: { [queryId: string]: Pagination }

  constructor(store = {}) {
    this._store = store
  }

  set(q: Query, pagination: Pagination) {
    this._store[this.queryId(q)] = pagination
    return new QueryStore(this._store)
  }

  next(q: Query): number | null {
    const lastPage = this._store[this.queryId(q)]
    if (lastPage) return lastPage.next
    return 1
  }

  queryId(q: Query) {
    return `${q.nameSearch || ''}&${q.cohortFilters?.join(',') || ''}`
  }
}

export default function AdminUsersPage(props: F7Props): JSX.Element {
  const allowInfinite = useRef(true)

  const [state, setState] = useState(new State())

  const { locationId } = props.f7route.params
  const { status } = props.f7route.query
  assertNotUndefined(locationId)
  const location = store.findEntity<Location>(Location.uuid(locationId))
  assertNotNull(location)

  async function fetchUsers() {
    assertNotUndefined(locationId)
    const paged = status ? await getUsersForLocation(locationId, 1, status) : await getUsersForLocation(locationId, 1)

    setState({
      ...state, users: paged.data, isLoaded: true, pageState: paged.pagination, showPreloader: paged.pagination.count !== 0 && paged.pagination.count !== paged.data.length
    })
  }

  function loadMore(query?: string) {
    assertNotUndefined(locationId)
    if (!allowInfinite.current) return
    allowInfinite.current = false
    if (status) query = status
    console.log(status)
    setTimeout(() => {
      if (state.pageState.next === state.pageState.last || state.users.length === state.pageState.count) {
        setState({ ...state, showPreloader: false })
        return
      }
      const next = state.queryStore.next({ nameSearch: query })
      if (!next) return
      getUsersForLocation(locationId, next, query).then((paged) => {
        allowInfinite.current = true
        const queryStore = state.queryStore.set({ nameSearch: query }, paged.pagination)
        setState({
          ...state, users: _.uniqBy([...state.users, ...paged.data], (u) => u.id), isLoaded: true, pageState: paged.pagination, queryStore,
        })
      })
    }, 500)
  }

  useLayoutEffect(() => {
    f7.preloader.show()
    fetchUsers().finally(() => {
      f7.preloader.hide()
    })
  }, [])
  const grouped = groupByLetter(state.users)

  const debouncedSetState = useDebounce((state: State) => {
    if (!isBlank(state.query)) {
      const next = state.queryStore.next({ nameSearch: state.query })
      if (!next) {
        return
      }
      getUsersForLocation(locationId, next, state.query).then((paged) => {
        state.queryStore.set({ nameSearch: state.query }, paged.pagination)
        allowInfinite.current = true
        setState({
          ...state, users: _.uniqBy([...state.users, ...paged.data], (u) => u.id), isLoaded: true, pageState: { ...state.pageState, next: 1 }, query: state.query,
        })
      })
    }
  }, 500)

  return (
    <Page
      infinite
      infiniteDistance={50}
      infinitePreloader={state.showPreloader}
      onInfinite={loadMore}
    >
      <Navbar title="Users">
        <NavbarHomeLink slot="left" />
        {!status && (<Subnavbar inner={false}>

          <Searchbar
            searchContainer=".search-list"
            searchIn=".user-item > .item-link > .item-content > .item-inner"
            searchItem="li.user-item"
            onSearchbarSearch={(bar, query, prev) => {
              debouncedSetState({ ...state, query })
            }}
          />

        </Subnavbar>
        )}
        <NavRight>
          <Link href={dynamicPaths.adminUserAddPath({ locationId: location.id })}>
            <Icon f7="person_badge_plus" />
          </Link>
          <Link onClick={() => window.location.reload()}>
            <Icon f7="arrow_2_circlepath" />
          </Link>
        </NavRight>
      </Navbar>
      <List className="searchbar-not-found">
        <ListItem key="blank" title="Nothing found" />
      </List>
      <List className="search-list searchbar-found" contactsList>
        {
      sortBy(Object.entries(grouped), (letterUsers) => letterUsers[0]).map(([letter, users]) => (
        <ListGroup key={letter}>
          <ListItem key={letter} title={letter} groupTitle />
          {
            sortBy(users, (u) => u.reversedName().toUpperCase()).map((user) => <UserItem user={user} location={location} f7route={props.f7route} f7router={props.f7router} />)
          }
        </ListGroup>
      ))
    }
      </List>
    </Page>
  )
}
