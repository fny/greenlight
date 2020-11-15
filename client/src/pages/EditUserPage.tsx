import React, { useGlobal, useMemo, useState } from 'reactn'
import { Page, Navbar, f7, List, ListInput, Block, Button, ListItem } from 'framework7-react'
import { Router } from 'framework7/modules/router/router'

import { defineMessage, t, Trans } from '@lingui/macro'
import { useFormik, FormikProvider, FormikConfig } from 'formik'
import * as Yup from 'yup'

import { store, updateUser } from 'src/api'
import { reloadCurrentUser } from 'src/initializers/providers'

import { FunctionComponent } from '../types'
import Framework7 from 'framework7'
import logger from 'src/logger'
import { paths } from 'src/routes'
import { assertNotNull, equalDates, formatPhone, isBlank } from 'src/util'
import { User } from 'src/models'
import SubmissionHandler from 'src/misc/SubmissionHandler'
import { DATE } from 'src/models/Model'
import GL from 'src/initializers/GL'
import { DateTime } from 'luxon'

interface Props {
  f7route: Router.Route
  f7router: Router.Router
}

interface EditUserInput {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  zipCode: string
  birthDate: DateTime
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

const submissionHandler = new SubmissionHandler(f7)

const EditUserPage: FunctionComponent<Props> = ({ f7route, f7router }) => {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  const { userId } = f7route.params

  const user = store.findEntity<User>(`user-${userId}`)

  if (!user) {
    f7router.navigate(paths.notFoundPath)
    return <></>
  }
  // user.birthDate = DATE.deserialize!('1991-04-03')
  // GL.user = user
  // console.log('rendering')

  const formik = useFormik<EditUserInput>({
    validationSchema: schema,
    validateOnChange: true,
    initialValues: {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      mobileNumber: user.mobileNumber || '',
      zipCode: user.zipCode || '',
      birthDate: user.birthDate,
      physicianName: user.physicianName || '',
      physicianPhoneNumber: user.physicianPhoneNumber || '',
      needsPhysician: user.needsPhysician || false,
    },
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (!formik.dirty) return
        await updateUser(user, values)
        await reloadCurrentUser()
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

          {/* TODO: Daniel can you fix this? */}
          {/* <ListInput
            label={t({ id: 'EditUserPage.date_of_birth_label', message: 'Date of Birth' })}
            validateOnBlur
            value={[formik.values.birthDate.toJSDate()]}
            type="datepicker"
            calendarParams={{
              locale: global.locale,
              routableModals: false,
              onCalendarChange: (d: any) => {
                console.log(d)
              }
            }}
            onCalendarChange={(d) => {
              console.log(d[0])
              console.log(GL.user.birthDate.toJSDate())
              if (!equalDates(d[0], GL.user.birthDate.toJSDate())) {
                formik.handleChange({
                  target: {
                    name: 'birthDate',
                    value: DateTime.fromJSDate(d[0]),
                  },
                })
              }

            }}
          /> */}

          <ListInput
            name="physicianName"
            label={t({ id: 'EditUserPage.primary_care_physician_name_label', message: 'Primary Care Physician Name' })}
            validateOnBlur
            value={formik.values.physicianName}
            onInput={formik.handleChange}
          />

          <ListInput
            name="physicianPhoneNumber"
            label={t({
              id: 'EditUserPage.primary_care_physician_phone_number_label',
              message: 'Primary Care Physician Phone Number',
            })}
            validateOnBlur
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

export default EditUserPage
