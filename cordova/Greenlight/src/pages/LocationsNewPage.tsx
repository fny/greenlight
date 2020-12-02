import { t } from '@lingui/macro'
import {
  Block, Link, Navbar, Page,
} from 'framework7-react'
import React, { useGlobal } from 'reactn'
import If from 'src/components/If'
import { Location, User } from 'src/models'

import { paths } from 'src/routes'
import { F7Props } from 'src/types'

import 'yup-phone'
import LocationForm from './LocationForm'
import UsersNewBlock from './UsersForm'

export default function LocationsNewPage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')

  return (
    <Page>
      <Navbar title={t({ id: 'LocationsNewPage.title', message: 'Greenlight Durham' })} />
      <Block>

        <If test={currentUser === null}>
          <p>
            Welcome to Greenlight! Greenlight is brought to you by funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
          </p>
          <p>
            Before you register your business or school with Greenlight, you will need to create an account.
            If you have an account, you can <Link href={paths.rootPath}>sign in from the home screen</Link>.
          </p>
          <UsersNewBlock user={currentUser || new User()} f7router={props.f7router} />
        </If>
        <If test={currentUser !== null}>
          <p>
            Welcome to Greenlight! Greenlight is brought to you by funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
          </p>
          <p>
            Fill out the form below to create your new location.
          </p>
          <LocationForm location={new Location()} f7router={props.f7router} />
        </If>
      </Block>

    </Page>
  )
}
