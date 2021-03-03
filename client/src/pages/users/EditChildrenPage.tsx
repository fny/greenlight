import { Block, BlockTitle, Button, List, ListItem, Navbar, Page } from 'framework7-react'
import { useGlobal, useMemo, useEffect } from 'reactn'
import { store } from 'src/api'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { tr } from 'src/components/Tr'
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
      <Navbar title={tr({ en: 'My Children', es: 'Mis hijas', reviewTrans: true })} backLink />

      <Block>
        <p>
          <Tr
            en={`If you have any children add them here.`}
            es={`Si tienes hijos, agrégalos aquí.`}
            reviewTrans={true}
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
              title={`${child.firstName} ${child.lastName}`}
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
      </Block>
    </Page>
  )
}
