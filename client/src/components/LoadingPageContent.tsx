import {
  Block, Navbar, Preloader,
} from 'framework7-react'
import React from 'react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import EmailSupportLink from './EmailSupportLink'
import './LoadingPageContent.css'
import Tr, { En, Es, tr } from './Tr'

interface Props {
  title?: string
  hideNavbar?: boolean
}

export default function LoadingPageContent({ title, hideNavbar }: Props): JSX.Element {
  return (
    <>
      {!hideNavbar && (
      <Navbar title={title
        || tr({ en: 'Loading...', es: 'Cargando...' })}
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      )}
      <Block className="LoadingPageContent container">
        <div className="LoadingPageContent loader">
          <Preloader />
        </div>
      </Block>
      <Block>
        <p>
          <Tr>
            <En>
              Stuck here for too long?
              If your connection is stable, try refreshing the page.
              If you still need help, email support
              at <EmailSupportLink />.
            </En>
            <Es>
              ¿Esperando demasiado?
              Si su conexión es estable, actualiza la página.
              Si aún necesita ayuda, envia un correo electrónico
              a <EmailSupportLink />.
            </Es>
          </Tr>
        </p>
      </Block>
    </>
  )
}
