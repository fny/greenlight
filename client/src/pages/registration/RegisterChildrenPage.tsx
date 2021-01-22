import { t } from '@lingui/macro'
import { Block, Button, Link, Navbar, Page, List, ListItem, BlockTitle, Icon, f7 } from 'framework7-react'
import { Fragment, useGlobal, useCallback, useState, useMemo } from 'reactn'
import { registerUser } from 'src/api'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import LocalStorage from 'src/helpers/SessionStorage'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { Location } from 'src/models'
import { Roles } from 'src/models/LocationAccount'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { F7Props } from 'src/types'
import AddChildForm from './AddChildForm'
import { paths } from 'src/config/routes'

export default function RegisterChildrenPage(props: F7Props): JSX.Element {
  const { locationId } = props.f7route.params
  const [page, setPage] = useState('') // '' for children page, 'child' for add child page
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')

  assertNotUndefined(locationId)

  const submitHandler = useMemo(
    () =>
      new SubmitHandler(f7, {
        onSuccess: () => {
          props.f7router.navigate(paths.welcomeSurveyPath)
        },
        errorTitle: 'Something went wrong',
        errorMessage: 'User registration is failed',
        onSubmit: async () => {
          await registerUser(locationId, registeringUser)
        },
      }),
    [locationId, registeringUser],
  )

  const handleAddChild = useCallback(
    (child: RegisteringUser) => {
      const newRegisteringUser = {
        ...registeringUser,
        children: [...registeringUser.children, child],
      }
      LocalStorage.setRegisteringUser(newRegisteringUser)
      setRegisteringUser(newRegisteringUser)
      setPage('')
    },
    [registeringUser],
  )

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

          if (page === 'child') {
            return <AddChild onAddChild={handleAddChild} setPage={setPage} />
          }

          return (
            <ChildrenList
              registeringUser={registeringUser}
              location={location}
              setPage={setPage}
              onRegister={() => submitHandler.submit()}
            />
          )
        }}
      />
    </Page>
  )
}

function ChildrenList({
  registeringUser,
  location,
  setPage,
  onRegister,
}: {
  registeringUser: RegisteringUser
  location: Location
  setPage: (page: string) => any
  onRegister: () => any
}): JSX.Element {
  return (
    <Fragment>
      <Navbar title={t({ id: 'locationRegistered.add_children', message: 'Add your children' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <BlockTitle>If you have any children that attend {location.name} add them here.</BlockTitle>

        <BlockTitle>My Children</BlockTitle>
        <List>
          {registeringUser.children.map((child, index) => (
            <ListItem key={index} title={`${child.firstName} ${child.lastName}`} />
          ))}
          <ListItem
            link="#"
            title={registeringUser.children.length > 0 ? 'Add another child' : 'Add a child'}
            onClick={(e) => {
              e.preventDefault()
              setPage('child')
            }}
          />
        </List>
      </Block>

      <Block>
        <Button
          fill
          onClick={onRegister}
          disabled={registeringUser.role === Roles.Parent && registeringUser.children.length === 0}
        >
          {registeringUser.children.length > 0 ? 'Done adding children' : 'Skip adding children'}
        </Button>
      </Block>
    </Fragment>
  )
}

function AddChild({
  onAddChild,
  setPage,
}: {
  onAddChild: (child: RegisteringUser) => any
  setPage: (page: string) => any
}): JSX.Element {
  return (
    <Fragment>
      <Navbar title={t({ id: 'locationRegistered.add_children', message: 'Add your children' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <AddChildForm onSubmit={onAddChild} onDiscard={() => setPage('')} />
    </Fragment>
  )
}
