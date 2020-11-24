import { t, Trans } from '@lingui/macro'
import {
  Block,
  BlockTitle, Button, f7, Link, List, ListItem, ListItemCell, ListItemRow,
} from 'framework7-react'

import { Router } from 'framework7/modules/router/router'
import React, { useState } from 'react'
import FormikInput from 'src/components/FormikInput'
import FormikItem from 'src/components/FormikItem'
import { LocationCategories } from 'src/models/Location'
import { FormikInstance } from 'src/types'
import { Location } from 'src/models'
import * as Yup from 'yup'
import 'yup-phone'
import SubmissionHandler from 'src/misc/SubmissionHandler'
import { useFormik, FormikProvider } from 'formik'
import { reloadCurrentUser } from 'src/initializers/providers'
import { createLocation } from 'src/api'
import { assertNotNull, isBlank, isPresent } from 'src/util'
import { useGlobal } from 'reactn'
import { paths } from 'src/routes'

class LocationInput {
  name: string = ''

  zipCode: string = ''

  email: string = ''

  phoneNumber: string = ''

  website: string = ''

  permalink: string = ''

  category: LocationCategories | null = null

  employeeCount: number | null = null

  dailyReminderHour = 8

  dailyReminderAMPM: 'am' | 'pm' = 'am'

  remindMon = true

  remindTue = true

  remindWed = true

  remindThu = true

  remindFri = true

  remindSat = true

  remindSun = true
}

const cantBeBlankMessage = t({ id: 'Form.error_blank', message: "Can't be blank" })
const invalidMessage = t({ id: 'Form.error_invalid', message: 'Is invalid' })

export default function LocationForm({ location, f7router }: { location?: Location, f7router: Router.Router}) {
  const [locationCreated, setLocationCreated] = useState(false)
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  const submissionHandler = new SubmissionHandler(f7)
  const formik = useFormik<LocationInput>({
    validationSchema: schema,
    initialValues: new LocationInput(),
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          await createLocation({
            ...values,
            dailyReminderTime: values.dailyReminderHour + (values.dailyReminderAMPM === 'pm' ? 12 : 0),
          })
          await reloadCurrentUser()
          setLocationCreated(true)
        }
      })
    },
  })

  if (!locationCreated) {
    const ownerCount = currentUser.locationAccounts.filter((x) => x.permissionLevel === 'owner').length
    return (
      <FormikProvider value={formik}>
        <List
          form
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit(e)
          }}
        >
          <Block>
            <BlockTitle>
              <Trans id="LocationsNewPage.business_info_title">
                Your Business's Information
              </Trans>
            </BlockTitle>

            <Trans id="LocationsNewPage.business_info_instructions">
              Please fill out the form below with information about your business.
            </Trans>

            {ownerCount > 0 && (
            <span>{' '}
              <Trans id="LocationsNewPage.business_info_business_count">
                Note you already have registered {ownerCount} business. If you're having trouble with access send us an email help@greenlightready.com
              </Trans>
            </span>
            )}
            <BusinessLocationFields formik={formik} />
            <BusinessNotificationFields formik={formik} />
          </Block>
          <Button fill type="submit">
            <Trans id="BusinessLocationForm.create_location">Create Your Location</Trans>
          </Button>
        </List>
      </FormikProvider>
    )
  }
  location = currentUser?.locations__HACK()[currentUser?.locations__HACK().length - 1]

  assertNotNull(location)

  return (
    <Block>
      <h1>
        <Trans id="LocationsNewPage.business_created">
          Your Business Has Been Created
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
            Registration Code: {location.permalink}(case insensitive)
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
    </Block>
  )
}

function BusinessLocationFields({ formik }: { formik: FormikInstance<any>}) {
  return (
    <>
      <List noHairlines form onSubmit={() => { formik.submitForm() }}>
        <FormikInput
          label={t({ id: 'BusinessLocationForm.business_name', message: 'Business Name' })}
          name="name"
          type="text"
        />
        <FormikInput
          label={t({ id: 'BusinessLocationForm.business_id', message: 'Business ID (Used for Links)' })}
          name="permalink"
          placeholder="Lowercase letters, numbers, and dashes only"
          type="text"
        />
        {isPresent(formik.values.permalink) && isBlank(formik.errors.permalink)
        && (
        <ListItem>
          <Trans id="BusinessLocationForm.registrastion_link_url">
            Users will be able to register for your location by visiting:
            glit.me/l/{formik.values.permalink}
          </Trans>
        </ListItem>
        )}
        <FormikInput
          label={t({ id: 'BusinessLocationForm.zip_code', message: 'Zip Code' })}
          name="zipCode"
          type="text"
        />
        <FormikInput
          label={t({ id: 'BusinessLocationForm.number_of_employees', message: 'Number of Employees' })}
          name="employeeCount"
          type="number"
          min={1}
        />
      </List>
    </>
  )
}

function BusinessNotificationFields({ formik }: { formik: FormikInstance<any>}) {
  return (
    <Block>
      <BlockTitle>
        <Trans id="BusinessNotificationsForm.daily_reminders_title">
          Daily Reminders
        </Trans>
      </BlockTitle>
      <p>
        <Trans id="BusinessNotificationsForm.days_to_remind_footer">
          We send daily reminders to you and your employees to fill out their symptom surveys. We recommend that they fill them out daily.
          After employees sign up, they can change the time and days they're notified.
        </Trans>
      </p>
      <List accordionList noHairlines>
        <ListItem
          title={t({ id: 'BusinessNotificationsForm.time_to_remind', message: 'What time would you like send survey reminders?' })}
        />
        <ListItemRow>
          <ListItemCell>
            <FormikInput name="dailyReminderHour" label={t({ id: 'Common.hour', message: 'Hour' })} type="number" min="1" max="12" />
          </ListItemCell>
          <ListItemCell>
            <FormikInput name="dailyReminderAMPM" label="AM/PM" type="select">
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </FormikInput>
          </ListItemCell>
        </ListItemRow>
        <List style={{ marginTop: 0 }}>
          <ListItem
            title={t({ id: 'BusinessNotificationsForm.days_to_remind', message: 'What days would you like send survey reminders?' })}
          />
          <FormikItem
            title={t({ id: 'Weekday.monday', message: 'Monday' })}
            name="remindMon"
            checkbox
          />
          <FormikItem
            title={t({ id: 'Weekday.tuesday', message: 'Tuesday' })}
            name="remindTue"
            checkbox
          />
          <FormikItem
            title={t({ id: 'Weekday.wednesday', message: 'Wednesday' })}
            name="remindWed"
            checkbox
          />
          <FormikItem
            title={t({ id: 'Weekday.thursday', message: 'Thursday' })}
            name="remindThu"
            checkbox
          />
          <FormikItem
            title={t({ id: 'Weekday.friday', message: 'Friday' })}
            name="remindFri"
            checkbox
          />
          <FormikItem
            title={t({ id: 'Weekday.saturday', message: 'Saturday' })}
            name="remindSat"
            checkbox
          />
          <FormikItem
            title={t({ id: 'Weekday.sunday', message: 'Sunday' })}
            name="remindSun"
            checkbox
          />
        </List>
      </List>
    </Block>
  )
}

const schema = Yup.object<LocationInput>().shape({
  name: Yup.string().required(cantBeBlankMessage),
  // website: Yup.string(),
  // email: Yup.string()
  //   .email(invalidMessage).nullable(),
  // phoneNumber: Yup.string()
  //   .phone('US', undefined, t({ id: 'Form.error_invalid', message: 'Is invalid' })).nullable(),
  permalink: Yup.string()
    .matches(/^[a-z0-9-]+$/, { message: t({ id: 'LocationForm.permalink_error', message: 'only lowercase letters, dashes for spaces, and numbers' }) })
    .min(3)
    .required(cantBeBlankMessage),
  zipCode: Yup.string().matches(/^\d{5}$/, {
    excludeEmptyString: false,
    message: t({ id: 'LocationForm.invalid_zip_code', message: 'Zip code should be 5 digits' }),
  }).required(cantBeBlankMessage),
  employeeCount: Yup.number().min(1).required(cantBeBlankMessage).typeError(t({ id: 'LocationForm.employee_count_error', message: 'Please specify a number' })),
})
