import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, f7, Link, List, ListInput, ListItem, Page, PageContent, Row, Sheet, Toggle, Toolbar,
} from 'framework7-react'
import React, { useState } from 'react'
import { isBlank, isPresent, upperCaseFirst } from 'src/helpers/util'
import { toggleLocale } from 'src/helpers/global'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { LocationCategories, LOCATION_CATEGORIES } from 'src/models/Location'
import welcomeDoctorImage from 'src/assets/images/welcome-doctor.svg'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import { FormikProvider, useFormik } from 'formik'
import FormikInput from 'src/components/FormikInput'
import * as Yup from 'yup'
import { User, Location } from 'src/models'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { createUserAndSignIn, getCurrentUser } from 'src/api'
import { GLLocales } from 'src/i18n'
import { Router } from 'framework7/modules/router/router'
import 'src/lib/yup-phone'

function ResizingInput(props: React.HTMLProps<HTMLInputElement>): JSX.Element {
  const [value, setValue] = useState('')
  return (
    <input
      {...props}
      onChange={(e) => {
        setValue(e.target.value || '')
        props.onChange && props.onChange(e)
      }}
      size={(value ? value.length : props.placeholder?.length || 0) + 4}
    />
  )
}

class State {
  firstName?: string

  lastName?: string

  locationCategoriesOpened = false

  showErrors = false

  termsOpened = false

  locationCategory: LocationCategories | null = null
}

function validateUser(user: RegisteringUser) {
  const errors = []
  isBlank(user.firstName) && errors.push('firstName')
  isBlank(user.lastName) && errors.push('lastName')
  return errors
}

function validateLocation(location: RegisteringLocation) {
  const errors = []
  isBlank(location.zipCode) && errors.push('zipCode')
  !/^\d{5}$/.test(location.zipCode) && errors.push('zipCode')
  isBlank(location.category) && errors.push('category')
  return errors
}

class UserInput {
  firstName: string = ''

  lastName: string = ''

  email: string = ''

  mobileNumber: string= ''

  password: string= ''

  locale: GLLocales= 'en'
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

export default function RegisterLocationConfirmationPage(props: F7Props): JSX.Element {
  const [registeringUser, setRegisteringUser] = useGlobal('registeringUser')
  const [registeringLocation, setRegisteringLocation] = useGlobal('registeringLocation')
  const [state, setState] = useState(new State())

  return (
    <Page className="RegisterLocationWelcomePage">
      <style>
        {
          `
          .RegisterLocationWelcomePage .fill-in-the-blank {
            display: inline-block;
            border-bottom: 1px dashed black;
            text-align: center;
            color: var(--gl-green);
          }
          .RegisterLocationWelcomePage .category-select {
            cursor: pointer;
          }
          .RegisterLocationWelcomePage .introduction {
            font-size: 1.5rem;
          }
          .RegisterLocationWelcomePage .has-error {
            color: red;
            border-bottom: 1px dashed red;
          }
          .RegisterLocationWelcomePage .has-error::placeholder {
            color: red;
          }
          `
        }
      </style>
      {/* <Block>
        <h1>
          <Trans id="LocationsNewPage.business_created">
            Your Business Has Been Registered
          </Trans>
        </h1>
        <p>
          <Trans id="LocationsNewPage.business_created_instructions1">
            Your employees can now create their accounts by visitng the following
            link:
          </Trans>
        </p>
        <p style={{ fontWeight: 'bold' }}>{location.registrationWithCodeURL()}</p>
        <p>
          <Trans id="LocationsNewPage.business_created_instructions2">
            They can also sign up by visiting the app,
            clicking create account, and signing in with the following location id
            and registration code:
          </Trans>
        </p>
        <ul>
          <li>
            <Trans id="LocationsNewPage.business_created_business_id">
              Business ID: {location.permalink}
            </Trans>
          </li>
          <li>
            <Trans id="LocationsNewPage.business_created_registration_code">
              Registration Code: {location.registrationCode}(case insensitive)
            </Trans>
          </li>
        </ul>
        <p>
          <Trans id="LocationsNewPage.business_created_instructions3">
            You will also receive an email with these instructions.
            If you have any questions, feel free to email us at
            <Link href="mailto:help@greenlightready.com" external>help@greenlightready.com</Link>
          </Trans>
        </p>

        <Button fill href={paths.welcomeSurveyPath}>
          <Trans id="LocationsNewPage.surveys_button">
            Learn About Surveys
          </Trans>
        </Button>
      </Block> */}
    </Page>
  )
}
