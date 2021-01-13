import React, { useState, useRef } from 'react'
import { t, Trans } from '@lingui/macro'
import { useFormik, FormikProvider } from 'formik'
import {
  Button, f7, List, ListInput, ListItem,
} from 'framework7-react'

import { LocationAccount, PermissionLevels, Roles } from 'src/models/LocationAccount'
import SubmitHandler from 'src/helpers/SubmitHandler'
import FormikInput from 'src/components/FormikInput'
import { createTeacherStaff, updateTeacherStaff } from 'src/api'
import { User, Location } from 'src/models'
import * as Yup from 'yup'
import 'src/lib/yup-phone'
import { assertArray, assertNotNull } from 'src/helpers/util'

export class TeacherStaffInput {
  firstName: string = ''
  lastName: string = ''
  email: string = ''
  mobileNumber: string = ''
  cohorts: string[] = []

  permissionLevel: PermissionLevels = PermissionLevels.NONE
  role: string = Roles.TEACHER
}

interface Props {
  user?: User | null
  location: Location
  locationAccount?: LocationAccount | null
  onSuccess: () => void
}

export default function TeacherStaffForm({ user, location, locationAccount, onSuccess }: Props) {
  const submissionHandler = new SubmitHandler(f7)
  const initialValues: TeacherStaffInput = new TeacherStaffInput()
  let initialCohorts: string[] = []
  const cohortsRef = React.createRef<ListItem>()

  if (user) {
    initialValues.firstName = user.firstName
    initialValues.lastName = user.lastName
    initialValues.email = user.email || ''
    initialValues.mobileNumber = user.mobileNumber || ''
    initialCohorts = user.cohorts.map(cohort => cohort.code)
  }
  if (locationAccount) {
    initialValues.permissionLevel = locationAccount.permissionLevel || PermissionLevels.NONE
    initialValues.role = locationAccount.role || Roles.TEACHER
  }

  submissionHandler.onSuccess = onSuccess

  const formik = useFormik<TeacherStaffInput>({
    validationSchema: schema,
    initialValues,
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (!formik.dirty) return

        let cohorts
        if (cohortsRef.current) {
          cohorts = cohortsRef.current.f7SmartSelect.getValue()
          assertArray(cohorts)
        }
        
        if (user) {
          await updateTeacherStaff(user, location, { ...values, cohorts: cohorts || []})
        } else {
          await createTeacherStaff(location, { ...values, cohorts: cohorts || [] })
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

        {location.hasCohortSchema() && (
          <ListItem
            ref={cohortsRef}
            title="Cohorts"
            smartSelect
            smartSelectParams={{ searchbar: true, searchbarPlaceholder: 'Search Cohorts' }}
          >
            <select name="cohort" multiple defaultValue={initialCohorts}>
              {Object.keys(location.fullCohortSchema || {}).map((category) => {
                assertNotNull(location.fullCohortSchema)

                return (
                  <optgroup label={category}>
                    {location.fullCohortSchema[category].map((cohort) => (
                      <option value={cohort[0]}>{cohort[1]}</option>
                    ))}
                  </optgroup>
                )
              })}
            </select>
          </ListItem>
        )}

        <ListInput
          label={t({ id: 'AdminUserPermissionsPage.permission_level', message: 'Permission Level' })}
          type="select"
          name="permissionLevel"
          value={formik.values.permissionLevel}
          onInput={formik.handleChange}
        >
          <option value={PermissionLevels.NONE}>None</option>
          <option value={PermissionLevels.ADMIN}>Admin</option>
        </ListInput>
        <ListInput
          label={t({ id: 'Forms.role', message: 'Role' })}
          type="select"
          name="role"
          value={formik.values.role}
          onInput={formik.handleChange}
        >
          <option value={Roles.TEACHER}>Teacher</option>
          <option value={Roles.STAFF}>Staff</option>
        </ListInput>

        <Button style={{ marginTop: '1rem' }} type="submit" outline fill>
          <Trans id="Common.save">Save</Trans>
        </Button>
      </List>
    </FormikProvider>
  )
}

const schema = Yup.object<TeacherStaffInput>().shape({
  firstName: Yup.string().required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
  lastName: Yup.string().required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
  email: Yup.string()
    .email(t({ id: 'Form.error_invalid', message: 'Is invalid' }))
    .required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
  mobileNumber: Yup.string()
    .phone('US', t({ id: 'Form.error_invalid', message: 'Is invalid' }))
    .required(t({ id: 'Form.error_blank', message: "Can't be blank" })),
})
