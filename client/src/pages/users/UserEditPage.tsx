import { t, Trans } from '@lingui/macro'
import { FormikProvider, useFormik } from 'formik'
import {
  Block, Button, f7, List, ListInput, Navbar, Page,
} from 'framework7-react'
import { DateTime } from 'luxon'
import React, { useGlobal } from 'reactn'
import { store, updateUser } from 'src/api'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { reloadCurrentUser } from 'src/helpers/global'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { User } from 'src/models'
import { paths } from 'src/config/routes'
import {
  assertNotNull, formatPhone,
} from 'src/helpers/util'
import * as Yup from 'yup'
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
    message: t({ id: 'EditUserPage.invalid_zip_code', message: 'Zip code should be 5 digits' }),
  }),
})

const UserEditPage: FunctionComponent<F7Props> = ({ f7route, f7router }) => {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)
  const submissionHandler = new SubmitHandler(f7)

  const { userId } = f7route.params

  const user = store.findEntity<User>(`user-${userId}`)

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
      <Navbar title={t({ id: 'EditUserPage.title', message: 'Edit User' })} backLink />

      <FormikProvider value={formik}>
        <List form id="EditUserPage-form" onSubmit={formik.handleSubmit} noHairlines>
          <ListInput
            name="firstName"
            label={t({ id: 'EditUserPage.first_name_label', message: 'First Name' })}
            validateOnBlur
            value={formik.values.firstName}
            required
            onInput={formik.handleChange}
            errorMessage={t({ id: 'EditUserPage.first_name_missing', message: 'Please enter your first name.' })}
          />
          <ListInput
            name="lastName"
            label={t({ id: 'EditUserPage.last_name_label', message: 'Last Name' })}
            validateOnBlur
            value={formik.values.lastName}
            required
            onInput={formik.handleChange}
            errorMessage={t({ id: 'EditUserPage.last_name_missing', message: 'Please enter your last name.' })}
          />
          <ListInput
            name="email"
            label={t({ id: 'EditUserPage.email_label', message: 'Email' })}
            validateOnBlur
            value={formik.values.email}
            onInput={formik.handleChange}
            info={t({ id: 'EditUserPage.cant_be_changed', message: "Can't be changed at this time." })}
            disabled
          />
          <ListInput
            name="mobileNumber"
            label={t({ id: 'EditUserPage.mobile_number_label', message: 'Mobile Number' })}
            validateOnBlur
            value={formatPhone(formik.values.mobileNumber)}
            onInput={formik.handleChange}
            info={t({ id: 'EditUserPage.cant_be_changed', message: "Can't be changed at this time." })}
            disabled
          />

          <ListInput
            name="zipCode"
            label={t({ id: 'EditUserPage.zip_code_label', message: 'Zip Code' })}
            errorMessageForce
            errorMessage={formik.errors.zipCode}
            value={formik.values.zipCode}
            onInput={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* <ListInput
            label={t({ id: 'EditUserPage.date_of_birth_label', message: 'Date of Birth' })}
            value={isBlank(formik.values.birthDate) ? [] : [formik.values.birthDate]}
            type="datepicker"
            clearButton
            calendarParams={{
              locale: currentUser.locale,
              routableModals: false,
            }}
            onCalendarChange={(d) => {
              formik.handleChange({
                target: {
                  name: 'birthDate',
                  value: d === [] ? null : d[0],
                },
              })
            }}
          />

          <ListInput
            name="physicianName"
            label={t({ id: 'EditUserPage.primary_care_physician_name_label', message: 'Primary Care Physician Name' })}
            value={formik.values.physicianName}
            onInput={formik.handleChange}
          />

          <ListInput
            name="physicianPhoneNumber"
            label={t({
              id: 'EditUserPage.primary_care_physician_phone_number_label',
              message: 'Primary Care Physician Phone Number',
            })}
            value={formik.values.physicianPhoneNumber}
            type="tel"
            onInput={formik.handleChange}
          />

          <ListItem
            name="needsPhysician"
            checkbox
            title={t({ id: 'EditUserPage.need_help_finding_physician', message: 'Need help finding a physician?' })}
            checked={formik.values.needsPhysician}
            onChange={formik.handleChange}
          /> */}

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

export default UserEditPage
