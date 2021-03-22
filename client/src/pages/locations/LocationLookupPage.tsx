import React, { useState } from 'reactn'

import {
  Page, Block, Button, List, ListInput, Navbar,
} from 'framework7-react'
import { t, Trans } from '@lingui/macro'
import { F7Props } from 'src/types'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

export default function LocationLookupPage(props: F7Props): JSX.Element {
  const [permalink, setPermalink] = useState('')
  const [registrationCode, setRegistrationCode] = useState('')

  return (
    <Page>
      <Navbar title={t({ id: 'UserRegistration.lookup_business_or_school', message: 'Look Up Business or School' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <p>
          <Trans id="UserRegistration.lookup_business_or_school_instructions">
            You should have received a link from or code from your business or school. If you received a code, enter it
            below. The code is not case sensitive.
          </Trans>
        </p>
        <List noHairlines>
          <ListInput
            type="text"
            label={t({ id: 'UserRegistration.business_or_school_id', message: 'Business or School ID' })}
            placeholder={t({ id: 'UserRegistration.business_or_school_id', message: 'Business or School ID' })}
            required
            value={props.f7route.query['permalink']}
            onChange={(e) => setPermalink(e.target.value)}
          />
          <ListInput
            type="text"
            label={t({ id: 'UserRegistration.registration_code_label', message: 'Registration Code' })}
            placeholder={t({
              id: 'UserRegistration.registration_code_placeholder',
              message: 'Enter your registration code',
            })}
            required
            onChange={(e) => setRegistrationCode(e.target.value)}
          />
          <br />
          <Button href={`/go/${permalink}/code/${registrationCode}`} fill>
            <Trans id="UserRegistration.lookup_location">Lookup Location</Trans>
          </Button>
        </List>
      </Block>
    </Page>
  )
}
