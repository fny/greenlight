import { t, Trans } from '@lingui/macro'
import {
  Block, Link, Navbar, Page,
} from 'framework7-react'
import React, { useGlobal } from 'reactn'
import If from 'src/components/If'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { Location, User } from 'src/models'

import { paths } from 'src/routes'
import { F7Props } from 'src/types'

import 'yup-phone'
import LocationForm from './LocationForm'
import UserForm from './UsersForm'

export default function LocationsNewPage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')

  return (
    <Page>
      <Navbar title={t({ id: 'LocationsNewPage.title', message: 'Greenlight Durham' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        {
         (currentUser === null) ? (
           <>
             <p>
               <Trans id="LocationsNewPage.welcome">
                 Welcome to Greenlight! Greenlight is brought to you by funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
               </Trans>
             </p>
             <p>
               <Trans id="LocationsNewPage.registration_instructions">
                 Before you register your business or school with Greenlight, you will need to create an account.
                 If you have an account, you can <Link href={paths.splashPath} style={{ display: 'inline' }}>sign in from the home screen</Link>.
               </Trans>

             </p>
             <UserForm user={currentUser || new User()} f7router={props.f7router} />
           </>
         )
           : (
             <>
               <p>
                 <Trans id="LocationsNewPage.location_instructions">
                   Fill out the form below to create your new location. Greenlight is brought to you by funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
                 </Trans>
               </p>
               <LocationForm location={new Location()} f7router={props.f7router} />
             </>
           )
        }
      </Block>
    </Page>
  )
}
