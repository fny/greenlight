import React from 'react'
import { Page, Navbar, Link, Block, BlockTitle } from 'framework7-react'

export default () => (
  <Page>
    <Navbar title="Join Greenlight" backLink="Back"></Navbar>
    <Block strong noHairlines>
      <p>
        Greenlight is currently invitation only. Please contact your school to
        find out when your account will be opened.
      </p>
    </Block>
  </Page>
)
