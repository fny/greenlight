import { f7, Navbar, Page } from 'framework7-react'
import { useGlobal, useMemo, useCallback } from 'reactn'
import { addChild, deleteChild, store, updateChild } from 'src/api'
import AddChildForm from 'src/components/AddChildForm'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { tr } from 'src/components/Tr'
import { dynamicPaths, paths } from 'src/config/routes'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { User } from 'src/models'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { F7Props } from 'src/types'

export default function EditChildPage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  const submitHandler = new SubmitHandler(f7)

  const { userId, childId } = props.f7route.params

  assertNotNull(userId)
  assertNotUndefined(userId)
  assertNotNull(childId)
  assertNotUndefined(childId)

  const user = store.findEntity<User>(`user-${userId}`)
  const child = useMemo(() => {
    if (childId === 'new') {
      return new User()
    } else {
      return store.findEntity<User>(`user-${childId}`)
    }
  }, [childId])

  assertNotNull(child)
  assertNotUndefined(child)

  const handleUpdateChild = useCallback((child: RegisteringUser) => {
    if (childId === 'new') {
      submitHandler.submit(() => addChild(userId, child), {
        successMessage: tr({
          en: 'The child is registered successfully.',
          es: 'La niña está registrada con éxito.',
          reviewTrans: true,
        }),
        onSuccess: () => props.f7router.back(),
      })
    } else {
      submitHandler.submit(() => updateChild(userId, childId, child), {
        successMessage: tr({
          en: 'The child is updated successfully.',
          es: 'La niña se actualiza con éxito.',
          reviewTrans: true,
        }),
        onSuccess: () => props.f7router.back(),
      })
    }
  }, [])

  const handleDeleteChild = useCallback(() => {
    submitHandler.submit(() => deleteChild(userId, childId), {
      successMessage: tr({
        en: 'The child is updated successfully.',
        es: 'La niña se elimina exitosamente.',
        reviewTrans: true,
      }),
      onSuccess: () => props.f7router.back(),
    })
  }, [])

  if (!user) {
    props.f7router.navigate(paths.notFoundPath)
    return <></>
  }

  return (
    <Page>
      <Navbar
        title={
          childId === 'new'
            ? tr({ en: 'Add a new child', es: 'Agregar un niño nuevo', reviewTrans: true })
            : tr({ en: 'Edit child', es: 'Editar niña', reviewTrans: true })
        }
        backLink
      />

      <AddChildForm
        user={child?.toRegisteringUser()}
        onSubmit={handleUpdateChild}
        onDelete={childId === 'new' ? undefined : handleDeleteChild}
        onBack={() => {
          props.f7router.back()
        }}
      />
    </Page>
  )
}
