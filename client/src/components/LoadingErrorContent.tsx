import { AxiosResponse } from 'axios'
import {
  Block, Navbar,
} from 'framework7-react'
import React from 'react'
import EmailLink, { SUPPORT_EMAIL } from 'src/components/EmailLink'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es, tr } from './Tr'

function errorMessage(error: any): string {
  if (typeof error === 'string') {
    return error
  }
  if (error.response) {
    const response = error.response as AxiosResponse
    return `${error.message} ${response.data} (${response.status})`
  }
  return error.message
}

export default function LoadingErrorContent({ title, error }: { title?: string, error?: any }): JSX.Element {
  return (
    <>
      <Navbar title={title
        || tr({ en: 'Loading failed!', es: 'Carga falló!' })}
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <p>
          <Tr
            en="Something went wrong."
            es="Algo salió mal."
          />
        </p>

        <pre>
          <Tr en="Error Message:" es="Mensaje de Error:" />
          <br />
          {errorMessage(error)}
        </pre>

        <p>
          <Tr>
            <En>
              If you need help, email support
              at <EmailLink email={SUPPORT_EMAIL} />.
            </En>
            <Es>
              Si necesita ayuda, envia un correo electrónico
              a <EmailLink email={SUPPORT_EMAIL} />.
            </Es>
          </Tr>
        </p>
      </Block>
    </>
  )
}
