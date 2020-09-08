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
  ListItem
} from 'framework7-react'

import EmailOrPhoneInput from '../components/EmailOrPhoneInput'
import './SignInPage.css'
import fixtures from '../fixtures'

interface SignInProps {}
interface SignInState {
  emailOrPhone: string
  password: string
  rememberMe: boolean
}

export default class SignInPage extends React.Component<SignInProps, SignInState> {
  state: SignInState = {
    emailOrPhone: '',
    password: '',
    rememberMe: true
  }

  demoSignIn() {


    
    if (this.state.emailOrPhone?.includes('beyu')) {
      this.setGlobal({ currentUser: fixtures.users.beyu })
    } else {
      this.setGlobal({ currentUser: fixtures.users.mother })
    }


    this.$f7router.navigate('/welcome-parent')
  }

  render() {
    return (
      <Page className="SignInPage" noToolbar noSwipeback loginScreen>
        <Navbar title="Sign In" backLink="Back"></Navbar>
        <div className="greenlight-logo">
          Greenlight<span>.</span>
        </div>

        <List form>
          <li>
            <EmailOrPhoneInput value={this.state.emailOrPhone} onInput={(e) => {
              this.setState({ emailOrPhone: e.target.value })
            }} />
          </li>
          <ListInput
            type="password"
            placeholder="Your password"
            value={this.state.password}
            onInput={(e) => {
              this.setState({ password: e.target.value })
            }}
          />
          <ListItem checkbox value="check_2" title="Remember Me" />

          <Block>
            <Button outline fill onClick={() => this.demoSignIn() }>
              Sign In
            </Button>
          </Block>
        </List>
        <List>
          <BlockFooter>
            <Link href="/forgot-password">Forgot password?</Link>
          </BlockFooter>
        </List>
      </Page>
    )
  }
}
