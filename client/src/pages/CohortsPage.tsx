import {
  List, ListItem, Navbar, Page, Searchbar, Subnavbar,
} from 'framework7-react'
import React from 'react'

export default function CohortsPage(): JSX.Element {
  return (
    <Page>
      <Navbar title="Cohorts: Homeroom">
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
        <ListItem checkbox title="A" />
        <ListItem checkbox title="B" />
        <ListItem checkbox title="C" />
        <ListItem checkbox title="D" />
        <ListItem checkbox title="E" />
        <ListItem checkbox title="F" />
      </List>
    </Page>
  )
}
