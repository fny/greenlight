import React, { useGlobal } from 'reactn'
import { Page, Block, Button } from 'framework7-react'

import './SplashPage.css'
import { signOut, toggleLocale } from 'src/helpers/global'
import { Trans } from '@lingui/macro'
import releaseData from 'src/assets/data/releases'
import { paths } from 'src/config/routes'
import { F7Props } from 'src/types'

import greenlightLogo from 'src/assets/images/logos/greenlight-banner-logo.svg'
import Tr from 'src/components/Tr'

export default function SplashPage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  return (
    <Page className="SplashPage" noToolbar noNavbar noSwipeback loginScreen>
      <Block>
        <div className="welcome">
          <Trans id="SplashPage.welcome">Welcome to</Trans>
        </div>
        <div className="logo">
          <img src={greenlightLogo} alt="Greenlight" />
        </div>

        {currentUser ? (
          <>
            <Button outline href={paths.rootPath}>
              <Tr en="Panel principal" es="Cerrar Sesión" />
            </Button>
            <Button outline onClick={() => signOut(props.f7router)}>
              <Tr en="Sign Out" es="Cerrar Sesión" />
            </Button>
          </>
        ) : (
          <Button outline href={paths.signInPath}>
            <Tr en="Sign In" es="Iniciar Sesión" />
          </Button>
        )}

        <Button outline href={paths.newUserPath}>
          <Trans id="SplashPage.create_account">Create Account</Trans>
        </Button>

        <Button outline href={paths.registerLocationWelcomePath}>
          <Tr en="Register Organization" es="Registrar Organización" />

        </Button>

        {/* <Button outline href={paths.durhamRegistationPath}>
          <Trans id="SplashPage.register_business">Register Business</Trans>
        </Button> */}

        <Button outline onClick={() => toggleLocale()} style={{ border: 0 }}>
          <Trans id="SplashPage.choose_language">En Español</Trans>
        </Button>
      </Block>

      <p className="copyright">
        &copy;
        {new Date().getFullYear()} Greenlight Ready LLC
        <br />
        <Trans id="Common.version">Version</Trans> {releaseData[0].version}
      </p>
    </Page>
  )
}
