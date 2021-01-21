import { useState } from 'reactn'

import { Page, Block, Button, List, ListInput, Navbar } from 'framework7-react'
import { t, Trans } from '@lingui/macro'
import { F7Props } from 'src/types'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

export default function UsersNewPage(props: F7Props): JSX.Element {
  const [error, setError] = useState<any>(null)
  const [myPermalink, setMyPermalink] = useState('')
  const [myCode, setMyCode] = useState('')

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
        {error && (
          <p style={{ color: 'red' }}>
            <Trans id="UserRegistration.lookup_error">
              There was an error looking up your business or school. Please make sure your information is correct.
            </Trans>
          </p>
        )}
        <List noHairlines>
          <ListInput
            type="text"
            label={t({ id: 'UserRegistration.business_or_school_id', message: 'Business or School ID' })}
            placeholder={t({ id: 'UserRegistration.business_or_school_id', message: 'Business or School ID' })}
            required
            onChange={(e) => setMyPermalink(e.target.value)}
          />
          <ListInput
            type="text"
            label={t({ id: 'UserRegistration.registration_code_label', message: 'Registration Code' })}
            placeholder={t({
              id: 'UserRegistration.registration_code_placeholder',
              message: 'Enter your registration code',
            })}
            required
            onChange={(e) => setMyCode(e.target.value)}
          />
          <br />
          <Button href={`/go/${myPermalink}/code/${myCode}`} fill>
            <Trans id="UserRegistration.lookup_location">Lookup Location</Trans>
          </Button>
        </List>
      </Block>
    </Page>
  )
}
