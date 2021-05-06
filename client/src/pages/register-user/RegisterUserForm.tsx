import { useFormik, FormikProvider } from 'formik'
import {
  Button, List, ListInput, ListItem, Toggle,
} from 'framework7-react'
import React, { useState } from 'react'
import { useGlobal } from 'reactn'
import * as Yup from 'yup'
import 'src/lib/yup-phone'
import { RegisteringUser } from 'src/models/RegisteringUser'
import FormikInput from 'src/components/FormikInput'
import { Roles } from 'src/models/LocationAccount'
import { getKeyName } from 'src/helpers/util'
import Tr, { tr } from 'src/components/Tr'

export default function RegisterUserForm({
  user,
  onUpdateUser,
}: {
  user?: Partial<RegisteringUser>
  onUpdateUser: (user: RegisteringUser) => any
}): JSX.Element {
  const [locale] = useGlobal('locale')
  const [revealPassword, setRevealPassword] = useState(false)

  const formik = useFormik<RegisteringUser & { password: string }>({
    validationSchema: schema,
    initialValues: {
      ...new RegisteringUser(),
      password: '',
      ...user,
    },
    onSubmit: (values) => {
      if (formik.dirty) {
        if (values.role === Roles.Unknown) {
          values.role = values.availableRoles[0]
        }
        onUpdateUser(values)
      }
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
        {formik.values.availableRoles.length > 0 && (
          <FormikInput label={tr({ en: 'Role', es: 'Papel' })} name="role" type="select" floatingLabel>
            {formik.values.availableRoles.map((role) => (
              <option key={role} value={role}>
                {getKeyName(Roles, role)}
              </option>
            ))}
          </FormikInput>
        )}
        <FormikInput
          label={tr({ en: 'First Name', es: 'Primero' })}
          name="firstName"
          type="text"
          floatingLabel
        />
        <FormikInput
          label={tr({ en: 'Last Name', es: 'Apellido' })}
          name="lastName"
          type="text"
          floatingLabel
        />
        <FormikInput label={tr({ en: 'Email', es: 'Correo electrónico' })} name="email" type="email" floatingLabel />
        <FormikInput
          label={tr({ en: 'Mobile Number', es: 'Teléfono Móvil' })}
          name="mobileNumber"
          type="tel"
          floatingLabel
        />

        <FormikInput
          label={tr({ en: 'Zip Code', es: 'Código Postal' })}
          name="zipCode"
          type="text"
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
        <ListInput label={tr({ en: 'Langauge', es: 'Lengua' })} type="select" defaultValue={locale}>
          <option value="en">{tr({ en: 'English', es: 'English' })}</option>
          <option value="es">{tr({ en: 'Español', es: 'Español' })}</option>
        </ListInput>

        <Button style={{ marginTop: '1rem' }} type="submit" outline fill>
          <Tr en="Register" es="Registrar" />
        </Button>
      </List>
    </FormikProvider>
  )
}

const schema = Yup.object<RegisteringUser>().shape({
  firstName: Yup.string().required(tr({ es: 'No puede estar en blanco', en: "Can't be blank" })),
  lastName: Yup.string().required(tr({ es: 'No puede estar en blanco', en: "Can't be blank" })),
  // !TODO: Should be able to check if the email or mobile number is available (not duplicated)
  email: Yup.string()
    .email(tr({ es: 'No es valido', en: 'Is invalid' }))
    .required(tr({ es: 'No puede estar en blanco', en: "Can't be blank" })),
  mobileNumber: Yup.string()
    .phone(tr({ es: 'No es valido', en: 'Is invalid' }))
    .required(tr({ es: 'No puede estar en blanco', en: "Can't be blank" })),
  password: Yup.string().min(8, tr({ es: 'debe tener al menos 8 caracteres ', en: 'must be at least 8 characters' })).required(tr({ es: 'No puede estar en blanco', en: "Can't be blank" })),
  zipCode: Yup.string().matches(/^\d{5}$/, {
    excludeEmptyString: true,
    message: tr({ es: 'El código postal debe tener 5 dígitos', en: 'Zip code should be 5 digits' }),
  }),
})
