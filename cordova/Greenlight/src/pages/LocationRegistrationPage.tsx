import React from 'reactn'
import {
  f7, Page, Navbar, Block, Button, List, ListInput,
} from 'framework7-react'
import { Trans, t } from '@lingui/macro'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'

import { FunctionComponent, F7Props } from 'src/types'
import SubmissionHandler from 'src/misc/SubmissionHandler'

interface RegistrationInput {
  firstName: string
  lastName: string
  email: string
  registrationCode: string
}

const schema = Yup.object<RegistrationInput>().shape({
  firstName: Yup.string().required(
    t({ id: 'LocationRegistrationPage.first_name_required', message: 'Please input first name' }),
  ),
  lastName: Yup.string().required(
    t({ id: 'LocationRegistrationPage.last_name_required', message: 'Please input last name' }),
  ),
  email: Yup.string().email(
    t({ id: 'LocationRegistrationPage.invalid_email', message: 'Please input valid email address' }),
  ),
  registrationCode: Yup.string().required(
    t({ id: 'LocationRegistrationPage.registration_code_required', message: 'Please input registration code' }),
  ),
})

const submissionHandler = new SubmissionHandler(f7)

const LocationRegistrationPage: FunctionComponent<F7Props> = () => {
  const formik = useFormik<RegistrationInput>({
    validationSchema: schema,
    validateOnChange: true,
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      registrationCode: '',
    },
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        console.log('submit', values)
        return Promise.resolve()
      })
    },
  })

  return (
    <Page>
      <Navbar title={t({ id: 'LocationRegistrationPage.title', message: 'GreenLight Cafe Registration' })} />

      <FormikProvider value={formik}>
        <List form id="LocationRegistrationPage-form" onSubmit={formik.handleSubmit} noHairlines>
          <ListInput
            name="firstName"
            label={t({ id: 'LocationRegistrationPage.first_name', message: 'First Name' })}
            value={formik.values.firstName}
            onInput={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.errors.firstName}
            errorMessageForce
          />

          <ListInput
            name="lastName"
            label={t({ id: 'LocationRegistrationPage.last_name', message: 'Last Name' })}
            value={formik.values.lastName}
            onInput={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.errors.lastName}
            errorMessageForce
          />

          <ListInput
            name="email"
            label={t({ id: 'LocationRegistrationPage.email', message: 'Email' })}
            value={formik.values.email}
            onInput={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.errors.email}
            errorMessageForce
          />

          <ListInput
            name="registrationCode"
            label={t({ id: 'LocationRegistrationPage.registration_code', message: 'Registration Code' })}
            value={formik.values.registrationCode}
            onInput={formik.handleChange}
            onBlur={formik.handleBlur}
            errorMessage={formik.errors.registrationCode}
            errorMessageForce
          />

          <Block>
            <Button type="submit" outline fill>
              <Trans id="Common.submit">Submit</Trans>
            </Button>
          </Block>
        </List>
      </FormikProvider>
    </Page>
  )
}

export default LocationRegistrationPage
