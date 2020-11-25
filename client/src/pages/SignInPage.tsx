import React, { setGlobal, useState } from 'reactn'

import {
  Page,
  List,
  ListInput,
  Navbar,
  Link,
  Block,
  Button,
  BlockFooter,
  ListItem,
  f7,
} from 'framework7-react'

import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import './SignInPage.css'
import { createSession, getCurrentUser } from 'src/api'
import { t, Trans } from '@lingui/macro'
import { paths, dynamicPaths } from 'src/routes'
import { F7Props } from 'src/types'

export default function SignInPage(props: F7Props) {
  const emailOrMobileRef = React.createRef<EmailOrPhoneListInput>()
  const passwordRef = React.createRef<ListInput>()

  const initialState = {
    emailOrMobile: '',
    password: '',
    rememberMe: false,
  }

  const [state, setState] = useState(initialState)

  function validate() {
    const passwordValid = f7.input.validateInputs('#sign-in-form')
    const emailOrMobileValid = emailOrMobileRef.current?.validate(emailOrMobileRef.current?.state.value || '')
    return passwordValid && emailOrMobileValid
  }

  async function submit() {
    if (!validate()) {
      return
    }
    f7.dialog.preloader(
      t({ id: 'SignInPage.signing_you_in', message: 'Signing you in...' }),
    )
    try {
      await createSession(state.emailOrMobile, state.password, state.rememberMe)

      const user = await getCurrentUser()
      f7.dialog.close()
      setGlobal({ currentUser: user })
      props.f7router.navigate(dynamicPaths.currentUserHomePath())
    } catch (error) {
      f7.dialog.close()

      f7.dialog.alert(
        t({ id: 'SignInPage.credentials_incorrect', message: 'The credentials your provided are incorrect.' }),
        t({ id: 'SignInPage.sign_in_failed', message: 'Sign In Failed' }),
      )
    }
  }

  return (
    <Page className="SignInPage" noToolbar>
      <Navbar
        title={t({ id: 'SignInPage.title', message: 'Sign In' })}
      >
        <Link href={paths.magicSignInPath} slot="right">
          <Trans id="SignInPage.with_magic">with Magic ✨</Trans>
        </Link>
      </Navbar>

      <div style={{ marginTop: '20px' }} className="greenlight-logo">
        Greenlight
        <span>.</span>
      </div>

      <List form id="sign-in-form">
        <EmailOrPhoneListInput
          ref={emailOrMobileRef}
          value={state.emailOrMobile}
          onInput={(e) => {
            setState({ ...state, emailOrMobile: e.target.value as string })
          }}
        />
        <ListInput
          type="password"
          ref={passwordRef}
          placeholder={
              t({ id: 'SignInPage.password_placeholder', message: 'Password' })
            }
          validateOnBlur
          value={state.password}
          required
          onInput={(e) => {
            setState({ ...state, password: e.target.value as string })
          }}
          errorMessage={t({ id: 'SignInPage.password_missing', message: 'Please enter your password' })}
        />
        <ListItem
          checkbox
          title={
              t({ id: 'SignInPage.remember_me', message: 'Remember me' })
            }
          onChange={(e) => {
            setState({ ...state, rememberMe: e.target.checked as boolean })
          }}
        />
        <Block>
          <Button outline fill onClick={() => submit()}>
            <Trans id="SignInPage.sign_in">
              Sign In
            </Trans>
          </Button>
        </Block>
      </List>
      <BlockFooter>
        <Link href={paths.magicSignInPath}>
          <Trans id="SignInPage.forgot_password">
            Forgot your password?
          </Trans>
        </Link>
        {/* <Link href="#">Request a password reset</Link> or use  magic sign in.  */}

      </BlockFooter>
    </Page>
  )
}
