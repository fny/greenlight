import {
  Block, Button, Navbar, Page, List, ListItem, BlockTitle, f7,
} from 'framework7-react'
import React, {
  Fragment, useGlobal, useCallback, useState, useMemo,
} from 'reactn'
import { registerUser, joinLocationWithChildren } from 'src/api'
import LoadingLocationContent from 'src/components/LoadingLocationContent'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import LocalStorage from 'src/helpers/LocalStorage'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { User, Location } from 'src/models'
import { Roles } from 'src/models/LocationAccount'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { F7Props } from 'src/types'
import { paths } from 'src/config/routes'
import Tr, { tr } from 'src/components/Tr'
import AddChildForm from './AddChildForm'

export default function RegisterChildrenPage(props: F7Props): JSX.Element {
  const { locationId } = props.f7route.params
  const [page, setPage] = useState('') // '' for children page, 'child' for add child page
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const [currentUser] = useGlobal('currentUser') as [User, any] // FIXME
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const [registeringUserDetail] = useGlobal('registeringUserDetail')
  assertNotUndefined(locationId)

  const submitHandler = useMemo(
    () => new SubmitHandler(f7, {
      onSuccess: (joinedLocation: boolean = false) => {
        if (joinedLocation) {
          props.f7router.navigate(paths.settingsPath)
        } else {
          props.f7router.navigate(paths.welcomeSurveyPath)
        }
      },
      errorTitle: 'Something went wrong',
      errorMessage: 'User registration is failed',
      onSubmit: async () => {
        // joining a location for the existing user
        if (currentUser) {
          await joinLocationWithChildren(locationId, registeringUser)
          return true
        }

        // creating a new user
        await registerUser(locationId, { ...registeringUser, password: registeringUserDetail })
      },
    }),
    [locationId, registeringUser],
  )

  const handleUpdateChild = useCallback(
    (child: RegisteringUser) => {
      const newRegisteringUser = {
        ...registeringUser,
      }
      if (selectedUser !== null) {
        newRegisteringUser.children = newRegisteringUser.children.map((v, i) => (i === selectedUser ? child : v))
      } else {
        newRegisteringUser.children = [...newRegisteringUser.children, child]
      }
      LocalStorage.setRegisteringUser(newRegisteringUser)
      setSelectedUser(null)
      setRegisteringUser(newRegisteringUser)
      setPage('')
    },
    [selectedUser, registeringUser],
  )

  const handleDelete = useCallback(() => {
    if (selectedUser !== null) {
      setRegisteringUser({
        ...registeringUser,
        children: registeringUser.children.filter((v, i) => i !== selectedUser),
      })
      setSelectedUser(null)
      setPage('')
    }
  }, [selectedUser, registeringUser])

  if (!registeringUser || registeringUser.registrationCode === '') {
    props.f7router.navigate(`/go/${locationId}`)
    return <div />
  }

  return (
    <Page>
      <LoadingLocationContent
        showNavbar
        showAsPage
        locationId={locationId}
        content={(state) => {
          const { location } = state
          assertNotNull(location)

          if (page === 'child') {
            return (
              <AddChild
                selectedUser={selectedUser !== null ? registeringUser.children[selectedUser] : null}
                onSubmitChild={handleUpdateChild}
                setPage={setPage}
                onDelete={handleDelete}
              />
            )
          }

          return (
            <ChildrenList
              registeringUser={registeringUser}
              location={location}
              setSelectedUser={setSelectedUser}
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
  setSelectedUser,
  onRegister,
}: {
  registeringUser: RegisteringUser
  location: Location
  setSelectedUser: (userIndex: number | null) => any
  setPage: (page: string) => any
  onRegister: () => any
}): JSX.Element {
  return (
    <Fragment>
      <Navbar title={tr({ en: 'Add Your Children', es: 'Registrar sus hijos' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <p>
          <Tr
            en={`If you have any children that attend ${location.name} add them here.`}
            es={`Si tiene algunos hijos quien asistir ${location.name} registrarlos aquí.`}
          />

        </p>

        <BlockTitle>
          <Tr en="My Children" es="Mis Hijos" />
        </BlockTitle>
        <List>
          {registeringUser.children.map((child, index) => (
            <ListItem
              link="#"
              key={index}
              title={`${child.firstName} ${child.lastName}`}
              after="Edit"
              onClick={(e) => {
                e.preventDefault()
                setSelectedUser(index)
                setPage('child')
              }}
            />
          ))}
          <ListItem
            link="#"
            title={registeringUser.children.length > 0 ? tr({ en: 'Add another child', es: 'Registrar otro hijo' }) : tr({ en: 'Add a child', es: 'Registrar un hijo' })}
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
          {registeringUser.children.length > 0
            ? tr({ en: 'Done adding children', es: 'Terminado' }) : tr({ en: 'Skip adding children', es: 'Seguir' })}
        </Button>
      </Block>
    </Fragment>
  )
}

function AddChild({
  selectedUser,
  onSubmitChild,
  setPage,
  onDelete,
}: {
  selectedUser: RegisteringUser | null
  onSubmitChild: (child: RegisteringUser) => any
  setPage: (page: string) => any
  onDelete: () => any
}): JSX.Element {
  return (
    <Fragment>
      <Navbar title={tr({ en: 'Add Your Children', es: 'Registrar sus hijos' })}>
        <NavbarHomeLink slot="left" />
      </Navbar>
      <AddChildForm user={selectedUser} onSubmit={onSubmitChild} onDiscard={() => setPage('')} onDelete={onDelete} />
    </Fragment>
  )
}
