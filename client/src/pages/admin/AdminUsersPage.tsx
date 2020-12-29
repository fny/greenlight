import { t } from '@lingui/macro'
import {
  AccordionContent, Icon, Link, List, ListGroup, ListItem, Navbar, NavLeft, NavRight, Page, Searchbar, Subnavbar,
} from 'framework7-react'
import React, { getGlobal, useGlobal } from 'reactn'
import { ReactNComponent } from 'reactn/build/components'
import { getUsersForLocation, store } from 'src/api'
import { User, Location } from 'src/models'
import { Dict } from 'src/types'
import UserJDenticon from 'src/components/UserJDenticon'
import { dynamicPaths, paths } from 'src/config/routes'
import { assertNotNull, assertNotUndefined, sortBy } from 'src/helpers/util'
import { NoCurrentUserError } from 'src/helpers/errors'
import { Router } from 'framework7/modules/router/router'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

interface Props {
  users: User[]
  location: Location
  route: Router.Route
  setParentState: any
}

class UsersList extends React.Component<Props, any> {
  groupByLetter() {
    const filterUsers = this.props.users.filter((u) => this.global.filters.filters.includes(u.lastGreenlightStatus?.status || '')
    || u.locationAccounts.some((la) => this.global.filters.filters.includes(la.role || ''))
    || u.cohorts.some((c) => this.global.filters.filters.includes(c.name.toLocaleLowerCase())))
    const grouped: Dict<User[]> = {}
    for (const user of filterUsers) {
      const letter = user.lastName[0]
      if (!grouped[letter]) grouped[letter] = []
      grouped[letter].push(user)
    }
    return grouped
  }

  userItem(user: User, location: Location) {
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
                  link={dynamicPaths.userSurveysNewPath(user.id, { redirect: this.props.route.path })}
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

  render() {
    const grouped = this.groupByLetter()
    const { global } = this
    return (
      <Page>
        <Navbar title="Users">
          <NavbarHomeLink slot="left" />
          <Subnavbar inner={false}>
            <Searchbar
              searchContainer=".search-list"
              searchIn=".user-item > .item-link > .item-content > .item-inner > .item-title"
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
          {this.props.location.permalink?.includes('greenlight')
          && (
          <ListItem
            title="Cohorts"
            smartSelect
            smartSelectParams={{ searchbar: true, searchbarPlaceholder: 'Search Cohorts' }}
          >
            <select
              name="cohort"
              multiple
              defaultValue={global.filters.filters}
              onChange={(e) => {
                const value = Array.from(e.target.selectedOptions, (option) => option.value)
                this.global.filters.filters = value
                this.setGlobal({ filters: this.global.filters })
              }}
            >
              <optgroup label="Role">
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </optgroup>
              <optgroup label="Timezone">
                <option value="est">EST</option>
                <option value="cst">CST</option>
                <option value="mst">MST</option>
                <option value="pst">PST</option>
              </optgroup>
              <optgroup label="Team">
                <option value="ed">Ed</option>
                <option value="business">Business</option>
              </optgroup>
            </select>
          </ListItem>
          )}
          {
          sortBy(Object.entries(grouped), (x) => x[0]).map(([letter, users]) => (
            <ListGroup key={letter}>
              <ListItem title={letter} groupTitle key={letter} />
              {sortBy(users, (u) => u.reversedName()).map((user) => this.userItem(user, this.props.location))}
            </ListGroup>
          ))
        }
        </List>
      </Page>
    )
  }
}

interface State {
  users: User[]
  isLoaded: boolean
}

export default class AdminUsersPage extends ReactNComponent<any, State> {
  user: User

  locationId: string

  constructor(props: any) {
    super(props)
    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    const { locationId } = this.$f7route.params
    assertNotUndefined(locationId)
    this.locationId = locationId

    this.user = this.global.currentUser
    this.state = {
      users: [],
      isLoaded: false,
    }
  }

  async fetchUsers() {
    const users = await getUsersForLocation(this.locationId)
    this.setState({ users, isLoaded: true })
  }

  componentDidMount() {
    this.$f7.preloader.show()

    this.fetchUsers().finally(() => {
      this.$f7.preloader.hide()
    })
  }

  // users = users.filter((u) => this.global.filters.filters.includes(u.lastGreenlightStatus?.status || '')
  // || u.locationAccounts.some((la) => this.global.filters.filters.includes(la.role || ''))
  // || u.cohorts.some((c) => this.global.filters.filters.includes(c.name.toLocaleLowerCase())))
  render() {
    const location = store.findEntity<Location>(`${Location.modelName}-${this.locationId}`)
    assertNotNull(location)
    return <UsersList users={this.state.users} route={this.$f7route} location={location} setParentState={this.setState} />
  }
}
