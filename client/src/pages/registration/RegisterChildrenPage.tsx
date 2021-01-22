import { t } from '@lingui/macro'
import { Block, Navbar, Page } from 'framework7-react'
import { Fragment, useGlobal } from 'reactn'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { F7Props } from 'src/types'

export default function RegisterChildrenPage(props: F7Props): JSX.Element {
  const { locationId } = props.f7route.params
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')

  assertNotUndefined(locationId)

  if (!registeringUser || registeringUser.registrationCode === '') {
    props.f7router.navigate(`/go/${locationId}`)
    return <div />
  }

  return (
    <Page>
      <LoadingLocationContent
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)

          return (
            <Fragment>
              <Navbar title={t({ id: 'locationRegistered.new_account', message: 'Create a New Account' })}>
                <NavbarHomeLink slot="left" />
              </Navbar>
              <Block>
                <h1>Add your children</h1>
                <p>If you have any children that attend {location.name} add them here.</p>
              </Block>
            </Fragment>
          )
        }}
      />
    </Page>
  )
}
