import { Block, BlockTitle, Button, Link, List, ListItem, Navbar, Page } from 'framework7-react'
import React from 'react'
import { useGlobal, useMemo, useEffect } from 'reactn'
import { store } from 'src/api'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es, tr } from 'src/components/Tr'
import { dynamicPaths, paths } from 'src/config/routes'
import { assertNotNull } from 'src/helpers/util'
import { User } from 'src/models'
import { F7Props } from 'src/types'

export default function EditChildrenPage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  const [recordStoreUpdatedAt] = useGlobal('recordStoreUpdatedAt')

  const { userId } = props.f7route.params
  const user = useMemo(() => store.findEntity<User>(`user-${userId}`), [recordStoreUpdatedAt])

  useEffect(() => {
    console.log('use effect works')
  }, [])

  if (!user) {
    props.f7router.navigate(paths.notFoundPath)
    return <></>
  }

  return (
    <Page>
      <Navbar title={tr({ en: 'My Children', es: 'Mis hijas' })} backLink />

      <Block>
        <p>
          <Tr
            en={`If you have any children add them here.`}
            es={`Si tienes hijos, agrégalos aquí.`}
          />
        </p>

        <BlockTitle>
          <Tr en="My Children" es="Mis Hijos" />
        </BlockTitle>
        <List>
          {user.children.map((child, index) => (
            <ListItem
              link="#"
              key={index}
              title={`${child.firstName} ${child.lastName} (${child.firstLocationName()})`}
              after="Edit"
              onClick={(e) => {
                e.preventDefault()
                props.f7router.navigate(dynamicPaths.editChildPath({ userId: userId, childId: child.id }))
              }}
            />
          ))}
          <ListItem
            link="#"
            title={
              user.hasChildren()
                ? tr({ en: 'Add another child', es: 'Registrar otro hijo' })
                : tr({ en: 'Add a child', es: 'Registrar un hijo' })
            }
            onClick={(e) => {
              e.preventDefault()
              props.f7router.navigate(dynamicPaths.editChildPath({ userId: userId, childId: 'new' }))
            }}
          />
        </List>
        <p>
          <Tr>
            <En>
              To add a new child to a new school, visit the <Link href={paths.locationLookupPath}>Join Location</Link> page and follow the steps given.
            </En>
            <Es>
              Para agregar nuevos niños a una escuela, visite la pagina para <Link href={paths.locationLookupPath}>Únese a la ubicación</Link> y siga los pasos indicados.
            </Es>
          </Tr>

        </p>
      </Block>
    </Page>
  )
}
