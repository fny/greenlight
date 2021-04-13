import {
  Navbar, Page, Toolbar, Link, Block, Tab, Tabs,
} from 'framework7-react'
import React from 'react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import './NCStatewideStatsPage.css'

export default function NCStatewideStatsPage(): JSX.Element {
  return (
    <Page className="NCStatwideStatsPage">
      <Navbar title="NC COVID-19 Statistics">
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Toolbar tabbar bottom>
        <Link tabLink="#tab-1" tabLinkActive>Cases Map</Link>
        <Link tabLink="#tab-2">By Day</Link>
        <Link tabLink="#tab-3">Deaths Map</Link>
      </Toolbar>
      <Tabs>
        <Tab id="tab-1" className="page-content" tabActive>
          <Block>
            <iframe src="https://datawrapper.dwcdn.net/Q8ZFj/26/" scrolling="no" frameBorder="0" />
          </Block>
        </Tab>
        <Tab id="tab-2" className="page-content">
          <Block>
            <iframe src="https://datawrapper.dwcdn.net/pdW1c/120/" scrolling="no" frameBorder="0" />
          </Block>
        </Tab>
        <Tab id="tab-3" className="page-content">
          <Block>
            <iframe
              src="https://datawrapper.dwcdn.net/WVXuJ/1/"
              scrolling="no"
              frameBorder="0"
            />
          </Block>

        </Tab>
      </Tabs>
    </Page>
  )
}
