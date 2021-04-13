import licenses from 'src/assets/data/licenses.json'
import { Block, Navbar, Page } from 'framework7-react'
import React from 'reactn'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es, tr } from 'src/components/Tr'

export default function OpenSourceLicensesPage() {
  return (
    <Page>
      <Navbar title={tr({ en: 'Open Source Licenses', es: 'Licencias de código abierto' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block strong noHairlines>
        <p>
          <Tr>
            <En>
              Greenlight is built using a lot of free and open source software.
              As such, we want to give credit to all of the wonderful projects
              we use. We've tried our best to list them all below.
            </En>
            <Es>
              Greenlight se construye con una gran cantidad de software gratuito y de código abierto. Como tal, queremos dar crédito a todos los maravillosos proyectos que utilizamos. Hemos hecho todo lo posible para enumerarlos todos a continuación.
            </Es>
          </Tr>
        </p>
        <ul>
          {
            licenses.map((l) => <li>{l.name} by {l.author} under the {l.licenseType} license</li>)
          }
        </ul>
      </Block>
    </Page>
  )
}
