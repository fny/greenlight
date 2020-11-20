import { defineMessage } from '@lingui/macro'
import {
  AccordionContent, Icon, Link, List, ListGroup, ListItem, Navbar, NavRight, Page, Searchbar, Subnavbar,
} from 'framework7-react'
import React, { getGlobal } from 'reactn'
import { ReactNComponent } from 'reactn/build/components'
import { getUsersForLocation } from 'src/api'
import { User } from 'src/models'
import { Dict } from 'src/types'
import UserJDenticon from 'src/components/UserJDenticon'
import { dynamicPaths, paths } from 'src/routes'
import { assertNotUndefined, sortBy } from 'src/util'
import { NoCurrentUserError } from 'src/errors'
import { Router } from 'framework7/modules/router/router'

interface Props {
  users: User[]
  route: Router.Route
}

class UsersList extends React.Component<Props, any> {
  groupByLetter() {
    const grouped: Dict<User[]> = {}
    for (const user of this.props.users) {
      const letter = user.lastName[0]
      if (!grouped[letter]) grouped[letter] = []
      grouped[letter].push(user)
    }
    return grouped
  }

  userItem(user: User) {
    return (
      <ListItem
        key={user.id}
        accordionItem
        link="#"
        title={user.reversedName()}
        after={
        user.greenlightStatus().title()
      }
      >
        <div slot="media">
          <UserJDenticon user={user} size={29} key={user.id} />
        </div>
        <AccordionContent key={user.id}>
          <List>
            {/* <ListItem
          link={`/users/${user.id}/covid-test`}
          title="Submit COVID Test"
        ></ListItem> */}
            {user.hasNotSubmittedOwnSurvey() && (
            <ListItem
              link={dynamicPaths.userSurveysNewPath(user.id, { redirect: this.props.route.path })}
              title="Check-In"
            />
            )}
            <ListItem
              link={dynamicPaths.userGreenlightPassPath(user.id)}
              title={getGlobal().i18n._(defineMessage({ id: 'DashboardPage.greenlight_pass', message: 'Greenlight Pass' }))}
            />
            {/* <ListItem
          link={`/users/${user.id}/absence`}
          title="Schedule Absence"
        ></ListItem> */}
          </List>
        </AccordionContent>
      </ListItem>
    )
  }

  render() {
    const grouped = this.groupByLetter()
    return (
      <Page>
        <Navbar title="Users">
          <Subnavbar inner={false}>
            <Searchbar
              searchContainer=".search-list"
              searchIn=".item-title"
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
          {
          sortBy(Object.entries(grouped), (x) => x[0]).map(([letter, users]) => (
            <ListGroup key={letter}>
              <ListItem title={letter} groupTitle key={letter} />
              {sortBy(users, (u) => u.reversedName()).map((user) => this.userItem(user))}
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
    const locatonId = this.$f7route.params.locationId
    assertNotUndefined(locatonId)
    this.locationId = locatonId

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

  render() {
    return <UsersList users={this.state.users} route={this.$f7route} />
  }
}
