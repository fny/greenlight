import { FormikProvider, useFormik } from 'formik'
import {
  Block, Button, f7, List, ListInput, Navbar, Page,
} from 'framework7-react'
import { DateTime } from 'luxon'
import React, { useGlobal, useMemo } from 'reactn'
import { store, updateUser } from 'src/api'
import { reloadCurrentUser } from 'src/helpers/global'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { User } from 'src/models'
import { paths } from 'src/config/routes'
import { assertNotNull, formatPhone } from 'src/helpers/util'
import * as Yup from 'yup'
import Tr, { tr } from 'src/components/Tr'
import { F7Props, FunctionComponent } from '../../types'

interface EditUserInput {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  zipCode: string
  birthDate: Date | null
  physicianName: string
  physicianPhoneNumber: string
  needsPhysician: boolean
}

const schema = Yup.object<EditUserInput>().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  zipCode: Yup.string().matches(/^\d{5}$/, {
    excludeEmptyString: true,
    message: tr({ en: 'Zip code should be 5 digits', es: 'Codigo necesita 5 numeros' }),
  }),
})

const UserEditPage: FunctionComponent<F7Props> = ({ f7route, f7router }) => {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)
  const submissionHandler = new SubmitHandler(f7)
  const [recordStoreUpdatedAt] = useGlobal('recordStoreUpdatedAt')

  const { userId } = f7route.params

  const user = useMemo(() => store.findEntity<User>(`user-${userId}`), [recordStoreUpdatedAt])

  if (!user) {
    f7router.navigate(paths.notFoundPath)
    return <></>
  }

  const formik = useFormik<EditUserInput>({
    validationSchema: schema,
    validateOnChange: true,
    initialValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
      zipCode: user.zipCode || '',
      birthDate: user.birthDate?.isValid ? user.birthDate.toJSDate() : null,
      physicianName: user.physicianName || '',
      physicianPhoneNumber: user.physicianPhoneNumber || '',
      needsPhysician: user.needsPhysician || false,
    },
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          await updateUser(user, {
            ...values,
            birthDate: values.birthDate ? DateTime.fromJSDate(values.birthDate) : null,
          })
          await reloadCurrentUser()
        }
        f7router.back()
      })
    },
  })

  return (
    <Page>
      <Navbar title={tr({ en: 'Edit User', es: 'Cambiar Usuario' })} backLink />

      <FormikProvider value={formik}>
        <List form id="EditUserPage-form" onSubmit={formik.handleSubmit} noHairlines>
          <ListInput
            name="firstName"
            label={tr({ en: 'First Name', es: 'Nombre' })}
            validateOnBlur
            value={formik.values.firstName}
            required
            onInput={formik.handleChange}
            errorMessage={tr({ en: 'Please enter your first name.', es: 'Entrar su nombre' })}
          />
          <ListInput
            name="lastName"
            label={tr({ en: 'Last Name', es: 'Apellido' })}
            validateOnBlur
            value={formik.values.lastName}
            required
            onInput={formik.handleChange}
            errorMessage={tr({ en: 'Please enter your last name.', es: 'Entrar su apellido.' })}
          />
          <ListInput
            name="email"
            label={tr({ en: 'Email', es: 'Correo Electrónico' })}
            validateOnBlur
            value={formik.values.email}
            onInput={formik.handleChange}
          />
          <ListInput
            name="mobileNumber"
            label={tr({ en: 'Mobile Number', es: 'Numero Movil' })}
            validateOnBlur
            value={formatPhone(formik.values.mobileNumber)}
            onInput={formik.handleChange}
          />

          <ListInput
            name="zipCode"
            label={tr({ en: 'Zip Code', es: 'Código Postal' })}
            errorMessageForce
            errorMessage={formik.errors.zipCode}
            value={formik.values.zipCode}
            onInput={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Block>
            <Button type="submit" outline fill>
              <Tr en="Submit" es="Enviar" />
            </Button>
          </Block>
        </List>
      </FormikProvider>
    </Page>
  )
}

export default UserEditPage
