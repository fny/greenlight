import {
  Block, Navbar, Preloader,
} from 'framework7-react'
import React from 'react'
import EmailLink, { SUPPORT_EMAIL } from 'src/components/EmailLink'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import './LoadingPageContent.css'
import Tr, { En, Es, tr } from './Tr'

export default function LoadingPageContent({ title }: { title?: string }): JSX.Element {
  return (
    <>
      <Navbar title={title
        || tr({ en: 'Loading...', es: 'Cargando...' })}
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
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
              at <EmailLink email={SUPPORT_EMAIL} />.
            </En>
            <Es>
              ¿Esperando demasiado?
              Si su conexión es estable, actualiza la página.
              Si aún necesita ayuda, envia un correo electrónico
              a <EmailLink email={SUPPORT_EMAIL} />.
            </Es>
          </Tr>
        </p>
      </Block>
    </>
  )
}
