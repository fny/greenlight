import React, { useGlobal } from 'reactn'
import { Page, Block, Button } from 'framework7-react'

import './SplashPage.css'
import { signOut, toggleLocale } from 'src/helpers/global'
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
          <Tr en="Welcome to" es="Bienvenido a" />
        </div>
        <div className="logo">
          <img src={greenlightLogo} alt="Greenlight" />
        </div>

        {currentUser ? (
          <>
            <Button outline href={paths.rootPath}>
              <Tr en="Dashboard" es="Panel principal" />
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

        <Button outline href={paths.locationLookupPath}>
          <Tr en="Create Account" es="Crear una Cuenta" />
        </Button>

        <Button outline href={paths.registerLocationWelcomePath}>
          <Tr en="Register Organization" es="Registrar Organización" />
        </Button>

        <Button outline onClick={() => toggleLocale()} style={{ border: 0 }}>
          <Tr en="En Español" es="In English" />
        </Button>
      </Block>

      <p className="copyright">
        <Tr
          en="Made with 💚 in Durham, NC"
          es="Hecho con 💚 en Durham, NC"
        />
        <br />
        &copy;
        {new Date().getFullYear()} Greenlight Ready LLC
        <br />
        <Tr en="Version" es="Versión" /> {releaseData[0].version}
      </p>
    </Page>
  )
}
