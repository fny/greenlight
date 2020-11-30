import {
  List, ListItem, Navbar, Page, Searchbar, Subnavbar,
} from 'framework7-react'
import React from 'react'

export default function CohortsPage(): JSX.Element {
  return (
    <Page>
      <Navbar title="Cohorts: Bus Route">
        <Subnavbar inner={false}>
          <Searchbar
            searchContainer=".search-list"
            searchIn=".item-title"
          />
        </Subnavbar>
      </Navbar>
      <List className="searchbar-not-found">
        <ListItem title="Nothing found" />
      </List>
      <List className="search-list searchbar-found">
        <ListItem checkbox title="A1" />
        <ListItem checkbox title="B2" />
        <ListItem checkbox title="3C" />
        <ListItem checkbox title="D4" />
        <ListItem checkbox title="5E" />
        <ListItem checkbox title="F5" />
      </List>
    </Page>
  )
}
