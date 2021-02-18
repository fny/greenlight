import { t, Trans } from '@lingui/macro'
import { Block, BlockTitle, Button, f7, List, ListInput, ListItem, Navbar, Page } from 'framework7-react'
import React, { useGlobal, useRef } from 'reactn'
import { store } from 'src/api'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { User } from 'src/models'
import { dynamicPaths, paths } from 'src/config/routes'
import { assertNotNull, formatPhone } from 'src/helpers/util'
import { F7Props, FunctionComponent } from '../../types'
import { tr } from 'src/components/Tr'

const ParentEditPage: FunctionComponent<F7Props> = ({ f7route, f7router }) => {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)
  const submissionHandler = new SubmitHandler(f7)

  const { userId, parentId } = f7route.params

  const user = store.findEntity<User>(`user-${userId}`)
  const parent = store.findEntity<User>(`user-${parentId}`)

  if (!user || !parent) {
    f7router.navigate(paths.notFoundPath)
    return <></>
  }

  return (
    <Page>
      <Navbar title={tr({ en: 'Edit Parent', es: 'Editar padre', reviewTrans: true })} backLink />

      <Block>
        <BlockTitle>Contact</BlockTitle>

        <List>
          {parent.mobileNumber && (
            <ListItem
              external
              link={`tel:${parent.mobileNumber}`}
              title={`Call ${parent.firstName}`}
              footer={formatPhone(parent.mobileNumber)}
            />
          )}
          {parent.email && (
            <ListItem
              external
              link={`mailto:${parent.email}`}
              title={`Email ${parent.firstName}`}
              footer={parent.email}
            />
          )}
        </List>
      </Block>

      <Block>
        <BlockTitle>Actions</BlockTitle>
        <List>
          <ListItem link={dynamicPaths.editUserPath({userId: parent.id})} title="Edit" />
          <ListItem link="#" title="Unlink" />
          <ListItem link="#" title="Delete Parent" />
        </List>
      </Block>
    </Page>
  )
}

export default ParentEditPage
