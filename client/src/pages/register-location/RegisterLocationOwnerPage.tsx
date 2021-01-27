import {
  Block,
  Button,
  f7,
  List,
  ListItem,
  Page,
  Toggle,
} from 'framework7-react'
import React, { useState } from 'react'
import { isBlank } from 'src/helpers/util'
import { reloadCurrentUser } from 'src/helpers/global'
import { lcTrans } from 'src/models/Location'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import { FormikProvider, useFormik } from 'formik'
import FormikInput from 'src/components/FormikInput'
import * as Yup from 'yup'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { createUserAndSignIn } from 'src/api'
import { Router } from 'framework7/modules/router/router'
import 'src/lib/yup-phone'
import Tr, { En, Es, tr } from 'src/components/Tr'

class UserInput {
  firstName: string = ''

  lastName: string = ''

  email: string = ''

  mobileNumber: string = ''

  password: string = ''
}

function UserForm({ user, f7router }: { user: UserInput; f7router: Router.Router }) {
  const [locale] = useGlobal('locale')
  const [revealPassword, setRevealPassword] = useState(false)

  const submissionHandler = new SubmitHandler(f7)

  const formik = useFormik<UserInput>({
    validationSchema: schema,
    initialValues: { ...new UserInput(), ...user },
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          await createUserAndSignIn({ ...values, locale })
          await reloadCurrentUser()
          f7router.navigate(paths.registerLocationDetailsPath)
        }
      })
    },
  })

  return (
    <FormikProvider value={formik}>
      <List
        noHairlines
        form
        onSubmit={(e) => {
          e.preventDefault()
          formik.submitForm()
        }}
      >
        {isBlank(user.firstName) && (
          <FormikInput
            label={tr({ en: 'First Name', es: 'Primero' })}
            name="firstName"
            type="text"
            floatingLabel
          />
        )}
        {isBlank(user.lastName) && (
          <FormikInput
            label={tr({ en: 'Last Name', es: 'Apellido' })}
            name="lastName"
            type="text"
            floatingLabel
          />
        )}
        <FormikInput label={tr({ en: 'Email', es: 'Correo Electrónico' })} name="email" type="email" floatingLabel />
        <FormikInput
          label={tr({ en: 'Mobile Number', es: 'Teléfono móvil' })}
          name="mobileNumber"
          type="tel"
          floatingLabel
        />
        <FormikInput
          label={tr({ en: 'Password', es: 'Contraseña' })}
          name="password"
          type={revealPassword ? 'text' : 'password'}
          floatingLabel
        />

        <ListItem>
          <span>
            <Tr en="Reveal Password" es="Mostrar Contraseña" />
          </span>
          <Toggle color="green" checked={revealPassword} onChange={() => setRevealPassword(!revealPassword)} />
        </ListItem>

        <Button style={{ marginTop: '1rem' }} type="submit" outline fill>
          Create Account
        </Button>
      </List>
    </FormikProvider>
  )
}

const schema = Yup.object<UserInput>().shape({
  firstName: Yup.string().required(tr({ en: "Can't be blank", es: 'No puede quedar vacío' })),
  lastName: Yup.string().required(tr({ en: "Can't be blank", es: 'No puede quedar vacío' })),
  email: Yup.string()
    .email(tr({ en: 'Is invalid', es: 'No es válido' }))
    .required(tr({ en: "Can't be blank", es: 'No puede quedar vacío' })),
  mobileNumber: Yup.string()
    .phone(tr({ en: 'Is invalid', es: 'No es válido' }))
    .required(tr({ en: "Can't be blank", es: 'No puede quedar vacío' })),
  password: Yup.string().min(8, tr({ en: 'must be at least 8 characters', es: 'debe tener al menos 8 caracteres' })),
})

export default function RegisterLocationOwnerPage(props: F7Props): JSX.Element {
  const [global] = useGlobal()

  return (
    <Page>
      <Block>
        <h1>
          <Tr en="Let's create your sign in." es="Crear su inicio de sesión." />
        </h1>
        <p>
          <Tr>
            <En>
              Before you tell us more about your
              {' '}
              {lcTrans(global.registeringLocation.category)}, we'll need to create an
              account for you.
            </En>
            <Es>
              Antes de describir su

              {lcTrans(global.registeringLocation.category)}, necesitaremos crear una
              cuenta por usted.
            </Es>
          </Tr>
        </p>
        <UserForm user={{ ...global.registeringUser, password: '' }} f7router={props.f7router} />
      </Block>
    </Page>
  )
}
