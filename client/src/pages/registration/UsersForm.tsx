import { t, Trans } from '@lingui/macro'
import { useFormik, FormikProvider } from 'formik'
import {
  Button, f7, List, ListInput, ListItem, Toggle,
} from 'framework7-react'
import { Router } from 'framework7/modules/router/router'
import React, { useState } from 'react'
import { useGlobal } from 'reactn'
import { createUserAndSignIn, getCurrentUser } from 'src/api'
import FormikInput from 'src/components/FormikInput'
import { GLLocales } from 'src/i18n'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { User } from 'src/models'
import * as Yup from 'yup'
import 'src/lib/yup-phone'
import { reloadCurrentUser } from 'src/initializers/providers'

class UserInput {
  firstName: string = ''

  lastName: string = ''

  email: string = ''

  mobileNumber: string= ''

  password: string= ''

  locale: GLLocales= 'en'
}

export default function UserForm({ user, f7router }: { user?: User, f7router: Router.Router}) {
  const [locale] = useGlobal('locale')
  const [revealPassword, setRevealPassword] = useState(false)

  const submissionHandler = new SubmitHandler(f7)

  const formik = useFormik<UserInput>({
    validationSchema: schema,
    initialValues: new UserInput(),
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          await createUserAndSignIn(values)
          await getCurrentUser()
          await reloadCurrentUser()
          f7router.refreshPage()
          // FIXME: We shouldn't have to do a hard refresh
          window.location.reload()
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
        <FormikInput
          label={t({ id: 'Forms.first_name', message: 'First Name' })}
          name="firstName"
          type="text"
          floatingLabel
        />
        <FormikInput
          label={t({ id: 'Forms.last_name', message: 'Last Name' })}
          name="lastName"
          type="text"
          floatingLabel
        />
        <FormikInput
          label={t({ id: 'Forms.email', message: 'Email' })}
          name="email"
          type="email"
          floatingLabel
        />
        <FormikInput
          label={t({ id: 'Forms.mobile_number', message: 'Mobile Number' })}
          name="mobileNumber"
          type="tel"
          floatingLabel
        />

        <FormikInput
          label={t({ id: 'Forms.password', message: 'Password' })}
          name="password"
          type={revealPassword ? 'text' : 'password'}
          floatingLabel
        />

        <ListItem>
          <span><Trans id="Forms.reveal_password">Reveal Password</Trans></span>
          <Toggle color="green" checked={revealPassword} onChange={() => setRevealPassword(!revealPassword)} />
        </ListItem>
        <ListInput
          label={t({ id: 'Forms.language', message: 'Language' })}
          type="select"
          defaultValue={locale}
        >
          <option value="en">
            {t({ id: 'Common.english', message: 'English' })}
          </option>
          <option value="es">
            {t({ id: 'Common.spanish', message: 'Español' })}
          </option>
        </ListInput>

        <Button style={{ marginTop: '1rem' }} type="submit" outline fill>
          <Trans id="Common.register">Register</Trans>
        </Button>
      </List>
    </FormikProvider>
  )
}

const schema = Yup.object<UserInput>().shape({
  firstName: Yup.string().required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
  lastName: Yup.string().required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
  email: Yup.string()
    .email(t({ id: 'Form.error_invalid', message: 'Is invalid' }))
    .required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
  mobileNumber: Yup.string()
    .phone('US', t({ id: 'Form.error_invalid', message: 'Is invalid' }))
    .required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
  password: Yup.string().min(8, t({ id: 'Form.password_invalid', message: 'must be at least 8 characters' })),
})
