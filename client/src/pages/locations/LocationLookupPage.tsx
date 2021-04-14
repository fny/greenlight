import React, { useState } from 'reactn'

import {
  Page, Block, Button, List, ListInput, Navbar,
} from 'framework7-react'
import { F7Props } from 'src/types'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es, tr } from 'src/components/Tr'

export default function LocationLookupPage(props: F7Props): JSX.Element {
  const [permalink, setPermalink] = useState(props.f7route.query.permalink || '')
  const [registrationCode, setRegistrationCode] = useState('')

  return (
    <Page>
      <Navbar title={tr({ en: 'Look Up Business or School', es: 'Buscar Negocio o Escuela' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <p>
          <Tr>
            <En>
              You should have received a link from or an ID and code from your business or school. If you received an ID and code, enter it
              below. The code is not case sensitive.
            </En>
            <Es>
              Debería haber recibido un enlace o una identificación y código de su empresa o escuela. Si recibió una identificación y un código, ingréselo.
            </Es>
          </Tr>
        </p>
        <List noHairlines>
          <ListInput
            type="text"
            label={tr({ en: 'Business or School ID', es: 'ID para negocio o escuela' })}
            placeholder={tr({ en: 'Business or School ID', es: 'ID para negocio o escuela' })}
            required
            value={props.f7route.query.permalink}
            onChange={(e) => setPermalink(e.target.value)}
          />
          <ListInput
            type="text"
            label={tr({ en: 'Registration Code', es: 'Codigo' })}
            placeholder={tr({
              en: 'Enter your registration code',
              es: 'Entrar su codigo de registración',
            })}
            required
            onChange={(e) => setRegistrationCode(e.target.value)}
          />
          <br />
          <Button href={`/go/${permalink}/code/${registrationCode}`} fill>
            <Tr en="Lookup Location" es="Buscar" />
          </Button>
        </List>
      </Block>
    </Page>
  )
}
