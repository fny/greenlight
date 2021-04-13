// TODO: Incomplete translation
import {
  Block,
  Link,
  Navbar,
  Page,
} from 'framework7-react'
import React from 'react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

export default function BrevardResourcesPage(): JSX.Element {
  return (
    <Page>
      <Navbar title="Connect to Care">
        <NavbarHomeLink slot="left" />
      </Navbar>

      <Block>
        <p>Connect with the school nurse, Tara Jelley: <Link href="mailto:tjelley@brevardacademy.org" external>tjelley@brevardacademy.org</Link></p>
        <p>Testing Locations:</p>
        <ul>
          <li>
            Mercy Urgent Care · (828) 210-2121<br />
            22 Trust Ln, Brevard, NC 28712
          </li>
          <li>
            Brevard Music Center · (828) 862-2100<br />
            349 Andante Ln, Brevard, NC 28712
          </li>
        </ul>
      </Block>
    </Page>
  )
}
