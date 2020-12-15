import { t, Trans } from '@lingui/macro'
import {
  Block, Link, Navbar, Page,
} from 'framework7-react'
import React, { useGlobal } from 'reactn'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { Location, User } from 'src/models'

import { paths } from 'src/config/routes'
import { F7Props } from 'src/types'

import LocationForm from './LocationForm'
import UserForm from './UsersForm'

export default function RegisterSchoolPage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')

  return (
    <Page>
      <Navbar title={t({ id: 'RegisterSchoolPage.title', message: 'Register a School' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        {
         (currentUser === null) ? (
           <>
             <p>
               <Trans id="RegisterSchoolPage.welcome">
                 Welcome to Greenlight! Greenlight is brought to you by our partner Curamericas Global.
               </Trans>
             </p>
             <p>
               <Trans id="RegisterSchoolPage.registration_instructions">
                 Before you register your school with Greenlight, you will need to create an account.
                 If you have an account, you can <Link href={paths.splashPath} style={{ display: 'inline' }}>sign in from the home screen</Link> and then continue here.
               </Trans>

             </p>
             <UserForm user={currentUser || new User()} f7router={props.f7router} />
           </>
         )
           : (
             <>
               <p>
                 <Trans id="RegisterSchoolPage.location_instructions">
                   Fill out the form below to register your school. Welcome to Greenlight! Greenlight is brought to you by our partner Curamericas Global.
                 </Trans>
               </p>
               <LocationForm location={new Location()} f7router={props.f7router} category="school" />
             </>
           )
        }
      </Block>
    </Page>
  )
}
