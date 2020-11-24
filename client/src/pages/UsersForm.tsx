import { t, Trans } from '@lingui/macro'
import { useFormik, FormikProvider } from 'formik'
import {
  Button, f7, List, ListItem, Toggle,
} from 'framework7-react'
import { Router } from 'framework7/modules/router/router'
import React, { useState } from 'react'
import { useGlobal } from 'reactn'
import { createUserAndSignIn, getCurrentUser } from 'src/api'
import FormikInput from 'src/components/FormikInput'
import { GLLocales } from 'src/i18n'
import SubmissionHandler from 'src/misc/SubmissionHandler'
import { User } from 'src/models'
import * as Yup from 'yup'

class UserInput {
  firstName: string = ''

  lastName: string = ''

  email: string = ''

  mobileNumber: string = ''

  password: string = ''

  physicanName: string = ''

  physicianPhoneNumber: string = ''

  needsPhysician: boolean = false

  locale: GLLocales = 'en'
}

export default function UserForm({ user, f7router }: { user?: User; f7router: Router.Router }) {
  const submissionHandler = new SubmissionHandler(f7)
  const [revealPassword, setRevealPassword] = useState(false)
  const [locale, setLocale] = useGlobal('locale')
  const formik = useFormik<UserInput>({
    validationSchema: Yup.object<UserInput>().shape({
      firstName: Yup.string().required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
      lastName: Yup.string().required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
      email: Yup.string()
        .email(t({ id: 'Form.error_invalid', message: 'Is invalid' }))
        .required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
      mobileNumber: Yup.string()
        .phone('US', undefined, t({ id: 'Form.error_invalid', message: 'Is invalid' }))
        .required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
      password: Yup.string().min(8),
    }),
    initialValues: new UserInput(),
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          await createUserAndSignIn(values)
          await getCurrentUser()
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
        <FormikInput label={t({ id: 'Forms.first_name', message: 'First Name' })} name="firstName" type="text" />
        <FormikInput label={t({ id: 'Forms.last_name', message: 'Last Name' })} name="lastName" type="text" />
        <FormikInput label={t({ id: 'Forms.email', message: 'Email' })} name="email" type="email" />
        <FormikInput
          label={t({ id: 'Forms.mobile_number', message: 'Mobile Number' })}
          name="mobileNumber"
          type="tel"
        />

        <FormikInput
          label={t({ id: 'Forms.password', message: 'Password' })}
          name="password"
          type={revealPassword ? 'text' : 'password'}
        />

        <ListItem>
          <span>Reveal Password</span>
          <Toggle color="green" checked={revealPassword} onChange={() => setRevealPassword(!revealPassword)} />
        </ListItem>
        <br />
        <br />
        <Button type="submit" outline fill>
          <Trans id="Common.register">Register</Trans>
        </Button>
      </List>
    </FormikProvider>
  )
}
