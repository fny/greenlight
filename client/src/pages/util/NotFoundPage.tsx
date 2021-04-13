import React from 'react'
import { Page, Navbar, Block } from 'framework7-react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr from 'src/components/Tr'

export default function NotFoundPage() {
  return (
    <Page>
      <Navbar title="Not found">
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block strong>
        <p>
          <Tr en="Sorry" es="Lo siento" />
        </p>
        <p>
          <Tr en="Requested content not found." es="No se encontró el contenido." />
        </p>
      </Block>
    </Page>
  )
}
