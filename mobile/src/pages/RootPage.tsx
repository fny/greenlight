import React, { useState, getGlobal } from 'reactn'
import {
  Page,
  List,
  LoginScreenTitle,
  ListInput,
  Row,
  Col,
  Navbar,
  Link,
  Block,
  BlockTitle,
  Segmented,
  Button,
  ListButton,
  BlockFooter,
  ListItem,
} from 'framework7-react'

import './RootPage.css'
import { paths } from '../routes'

interface Props {}
interface State {
}

export default class RootPage extends React.Component<Props, State> {
  state: State = {}

  render() {
    return (
      <Page className="RootPage" noToolbar noNavbar noSwipeback loginScreen>
        <Block>
          <div className="welcome">Welcome to</div>
          <div className="logo">
            Greenlight<span>.</span>
          </div>
          <br />
          <br />
          <br />
          <Button outline href="/sign-in">Sign In with Password</Button>
          <Button outline href="/magic-sign-in">Magic Sign In</Button>
          <Button outline href="/join">Join Greenlight</Button>
          <Button outline onClick={() => this.$f7router.navigate('asdfasfasdfa')}>Join Greenlight</Button>
        </Block>
      </Page>
    )
  }
}
