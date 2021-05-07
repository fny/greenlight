import {
  Block,
  List,
  ListItem,
  Navbar,
  Page,
  Icon,
  Button,
} from 'framework7-react'
import React from 'react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'

import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { assertNotNull } from 'src/helpers/util'
import Tr, { En, Es, tr } from 'src/components/Tr'

export default function SupplyHawkPage(): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  return (
    <Page className="SupplyHawkPage">
      <Navbar title={
        tr({
          en: 'Supply Hawk',
          es: 'Supply Hawk',
        })
      }
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <p>Supply Hawk, a medical supplier, is generously sponsoring Greenlight through June!</p>
        <p>
          Supply Hawk is also offering special pricing to Greenlight users.<br /><b>Take an additional 10% off with checkout code: GREENLIGHT.</b>
        </p>

        <p>
          For large orders, email <a href="mailto:info@supplyhawk.org">info@supplyhawk.org</a> for huge discounts! Make sure to tell them Greenlight sent you.
        </p>

        <p style={{textAlign: 'center'}}>
          <a href="https://supplyhawk.org">
            <img src="https://cdn.shopify.com/s/files/1/0383/1821/1205/files/text-logo_140x@2x.png?v=1589819802" />
          </a>
        </p>

            <Button fill={true} href="https://supplyhawk.org">
              Visit Supply Hawk
            </Button>


      </Block>
    </Page>
  )
}
