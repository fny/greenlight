import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, f7, Link, List, ListInput, ListItem, Page, PageContent, Row, Sheet, Toggle, Toolbar,
} from 'framework7-react'
import React, { useState } from 'react'
import { isBlank, isPresent, upperCaseFirst } from 'src/helpers/util'
import { toggleLocale } from 'src/helpers/global'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { lcTrans, LocationCategories, LOCATION_CATEGORIES } from 'src/models/Location'
import welcomeDoctorImage from 'src/assets/images/welcome-doctor.svg'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import { FormikProvider, useFormik } from 'formik'
import FormikInput from 'src/components/FormikInput'
import * as Yup from 'yup'
import { User } from 'src/models'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { createUserAndSignIn, getCurrentUser } from 'src/api'
import { GLLocales } from 'src/i18n'
import { Router } from 'framework7/modules/router/router'
import 'src/lib/yup-phone'

class UserInput {
  firstName: string = ''

  lastName: string = ''

  email: string = ''

  mobileNumber: string= ''

  password: string= ''
}

function UserForm({ user, f7router }: { user: UserInput, f7router: Router.Router}) {
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
          await getCurrentUser()
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
        { isBlank(user.firstName) && (
        <FormikInput
          label={t({ id: 'Forms.first_name', message: 'First Name' })}
          name="firstName"
          type="text"
          floatingLabel
        />
        )}
        { isBlank(user.lastName) && (
        <FormikInput
          label={t({ id: 'Forms.last_name', message: 'Last Name' })}
          name="lastName"
          type="text"
          floatingLabel
        />
        )}
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

        <Button style={{ marginTop: '1rem' }} type="submit" outline fill>
          Create Account
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

export default function RegisterLocationOwnerPage(props: F7Props): JSX.Element {
  const [global] = useGlobal()

  return (
    <Page>
      <Block>
        <h1>
          Let's create your sign in.
        </h1>
        <p>
          Before you tell us more about your {lcTrans(global.registeringLocation.category || LocationCategories.COMMUNITY)}, we'll need to create an account for you.
        </p>
        <UserForm user={global.registeringUser} f7router={props.f7router} />
      </Block>
    </Page>
  )
}
