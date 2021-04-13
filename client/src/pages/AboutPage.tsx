import React from 'react'
import {
  Page, Navbar, List, ListItem,
} from 'framework7-react'

import { paths } from 'src/config/routes'
import releaseData from 'src/assets/data/releases'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { tr } from 'src/components/Tr'

export default function AboutPage(): JSX.Element {
  return (
    <Page>
      <Navbar title={tr({ en: 'About', es: 'Información' })} backLink />
      <List noHairlines>
        <ListItem
          title={tr({ en: 'Greenlight Version', es: 'Versión de Greenlight' })}
          footer={releaseData[0].version}
          noChevron
        />
        <ListItem
          link="https://medium.com/greenlightready"
          title={tr({ en: 'Visit the Blog', es: 'Visite el Blog' })}
          external
        />
        <ListItem
          link="https://greenlightready.com"
          title={tr({ en: 'Visit our Website', es: 'Visite nuestro sitio web' })}
          external
        />
        <ListItem
          link={paths.openSourcePath}
          title={tr({ en: 'Open Source Licenses', es: 'Licencias de código abierto' })}
        />
        <ListItem
          link="https://docs.google.com/document/d/1kC7hXtFM2CftY7qegAEgStgw0auzM0t1BdKCoiS6uLM/?usp=sharing"
          title={tr({ en: 'Privacy Policy', es: 'Política de Privacidad' })}
          external
        />
        <ListItem
          link="https://app.greenlightready.com/terms"
          title={tr({ en: 'Terms of Service', es: 'Términos de Servicio' })}
          external
        />
      </List>
    </Page>
  )
}
