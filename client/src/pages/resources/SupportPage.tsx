import { Block, Navbar, Page } from "framework7-react";
import React from "react";
import NavbarHomeLink from "src/components/NavbarHomeLink";
import { tr } from "src/components/Tr";

export default function SupportPage(): JSX.Element {
  return (
    <Page className="PositiveResourcesPage">
      <Navbar title={
        tr({
          en: 'Contact Support',
          es: 'Caso sintomático o positivo',
        })
      }
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <h2>Need to get in touch?</h2>
        <p>Send us an email at help@greenlightready.com</p>
        <h2>¿Necesita ponerse en contacto?</h2>
        <p>Envíenos un correo electrónico a help@greenlightready.com.</p>
      </Block>
    </Page>
  )
}
