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
import './SessionsPage.css'
import { createSession, getCurrentUser } from 'src/api'
import { t, Trans } from '@lingui/macro'
import { paths, dynamicPaths } from 'src/config/routes'
import { F7Props, JSONAPIError } from 'src/types'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import logger from 'src/helpers/logger'
import Tr, { En, Es } from 'src/components/Tr'

import greenlightLogo from 'src/assets/images/logos/greenlight-banner-logo.svg'

export default function SignInPage(props: F7Props): JSX.Element {
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
      if (error.response && error.response.status === 422) {
        f7.dialog.alert(
          error.response.data.errors.map((x: JSONAPIError) => x.detail).join(' '),
          t({ id: 'SignInPage.sign_in_failed', message: 'Sign In Failed' }),
        )
      } else if (error.response) {
        f7.dialog.alert(
          `${t({ id: 'SignInPage.something_went_wrong', message: 'Something went wrong' })} (${error.response.status})`,
          t({ id: 'SignInPage.sign_in_failed', message: 'Sign In Failed' }),
        )
        logger.notify(error, { name: 'SignInServerError' })
        logger.error(error)
      } else {
        f7.dialog.alert(
          t({ id: 'SignInPage.something_went_wrong', message: 'Something went wrong' }),
          t({ id: 'SignInPage.sign_in_failed', message: 'Sign In Failed' }),
        )
        logger.notify(error, { name: 'SignInError' })
        logger.error(error)
      }
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
        <NavbarHomeLink slot="left" />
      </Navbar>

      <div className="greenlight-logo" style={{ marginTop: '50px' }}>
        <img src={greenlightLogo} alt="Greenlight" />
      </div>

      <List form id="sign-in-form" onSubmit={() => submit()}>
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
          <Button type="submit" outline fill>
            <Trans id="SignInPage.sign_in">
              Sign In
            </Trans>
          </Button>
        </Block>
      </List>
      <BlockFooter>
        <Tr reviewTrans>
          <En>
            Forgot your password?
            {' '}
            <Link href={paths.passwordResetRequestPath}>Request a reset</Link> or
            {' '}
            <Link href={paths.magicSignInPath}>a magic sign in link</Link>.
          </En>
          <Es>
            ¿Olvidó su contraseña? Solicitar
            {' '}
            <Link href={paths.passwordResetRequestPath}>un restablecimiento de contraseña</Link> or
            {' '}
            <Link href={paths.magicSignInPath}>un enlace de inicio de sesión mágico</Link>.
          </Es>
        </Tr>
      </BlockFooter>
    </Page>
  )
}
