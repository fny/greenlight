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
import { useFormik } from 'formik'
import { reloadCurrentUser } from 'src/initializers/providers'
import { createLocation, createUserAndSignIn } from 'src/api'
import { assertNotNull, isBlank, isPresent } from 'src/util'
import { useGlobal } from 'reactn'
import { paths } from 'src/routes'

class LocationInput {
  name: string | null = null

  zipCode: string | null = null

  email: string | null = null

  phoneNumber: string | null = null

  website: string | null = null

  permalink: string | null = null

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

export default function LocationForm({ location, f7router }: { location?: Location, f7router: Router.Router}) {
  const [almostFinished, setAlmostFinished] = useState(false)
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)
  const cantBeBlankMessage = t({ id: 'Form.error_blank', message: "Can't be blank" })
  const invalidMessage = t({ id: 'Form.error_invalid', message: 'Is invalid' })

  const submissionHandler = new SubmissionHandler(f7)

  const formik = useFormik<LocationInput>({
    validationSchema: Yup.object<LocationInput>().shape({
      name: Yup.string().required(cantBeBlankMessage),
      // website: Yup.string(),
      // email: Yup.string()
      //   .email(invalidMessage).nullable(),
      // phoneNumber: Yup.string()
      //   .phone('US', undefined, t({ id: 'Form.error_invalid', message: 'Is invalid' })).nullable(),
      permalink: Yup.string()
        .matches(/^[a-z0-9-]+$/, { message: t({ id: 'Form.error_invalid2', message: 'only lowercase letters, dashes for spaces, and numbers' }) })
        .min(3)
        .required(cantBeBlankMessage),
      zipCode: Yup.string().matches(/^\d{5}$/, {
        excludeEmptyString: true,
        message: t({ id: 'EditUserPage.invalid_zip_code', message: 'Zip code should be 5 digits' }),
      }).nullable(),
      employeeCount: Yup.number().min(1).required(cantBeBlankMessage),
    }),
    initialValues: new LocationInput(),
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          await createLocation({
            ...values,
            dailyReminderTime: values.dailyReminderHour + (values.dailyReminderAMPM === 'pm' ? 12 : 0),
          })
          await reloadCurrentUser()
          setAlmostFinished(true)
        }
      })
    },
  })

  if (!almostFinished) {
    return (
      <List
        form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit(e)
        }}
      >
        <LocationBlock formik={formik} />
        <LocationNotificationsBlock formik={formik} />
        <Button fill type="submit">
          <Trans id="LocationForm.create_location">Create Your Location</Trans>
        </Button>
      </List>
    )
  } else {
    const location = currentUser?.locations__HACK()[currentUser?.locations__HACK().length - 1]

    if (!location) {
      return (
        <Block>
          <h1>Your Location Has Been Created</h1>
          <p>Check your email for more information about how to
            register your employees. For now, let's fill out your first survey.
          </p>
          <Button fill href={paths.welcomeSurveyPath}>Learn About Surveys</Button>
        </Block>
      )
    }

    const url = `https://app.greenlightready.com/l/${location.permalink}/code/${location.registrationCode}`

    return (
      <Block>
        <h1>Your Location Has Been Created</h1>
        <p>
          Your employees can now create their accounts by visitng the following
          link:
          <br />
          <a href={url}>{url}</a>
          <br /><br />
          They can also sign up by visiting <a href="https://app.greenlightready.com">the app</a>,{' '}
          clicking create account, and signing in with the following location id
          and registration code:
          <br /><br />
          Location ID: {location.permalink}<br />
          Registration Code: {location.registrationCode} (case insensitive)
          <br /><br />
          If you have any questions, feel free to email us at help@greenlightready.com

          <br /><br />
          You will also receive an email with these instructions.
        </p>
        <Button fill href={paths.welcomeSurveyPath}>Learn About Surveys</Button>
      </Block>
    )
  }
}

function LocationBlock({ formik }: { formik: FormikInstance<any>}) {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)
  const ownerCount = currentUser.locationAccounts.filter((x) => x.permissionLevel === 'owner').length
  return (
    <>
      <Block>
        <BlockTitle>Your Business's Information</BlockTitle>
        Please fill out the form below with information about your business.{' '}
        {ownerCount > 0 && <span>Note you already have registered {ownerCount} business. If you're having trouble with access send us an email help@greenlightready.com</span>}

      </Block>
      <List noHairlines form onSubmit={() => { formik.submitForm() }}>
        <FormikInput
          label={t({ id: 'Forms.location_name', message: 'Location Name' })}
          name="name"
          type="text"
          formik={formik}
        />
        <FormikInput
          label={t({ id: 'Forms.location_id', message: 'Location ID (Used for Links)' })}
          name="permalink"
          placeholder="Lowercase letters, numbers, and dashes only"
          type="text"
          formik={formik}
        />
        {isPresent(formik.values.permalink) && isBlank(formik.errors.permalink)
        && (
        <ListItem>
          Users will be able to register for your location by visiting:<br />
          https://app.greenlightready.com/l/{formik.values.permalink}
        </ListItem>
        )}
        <FormikInput
          label={t({ id: 'Forms.zip_code', message: 'Zip Code' })}
          name="zipCode"
          type="text"
          formik={formik}
        />
        <FormikInput
          label="Number of employees"
          name="employeeCount"
          type="number"
          min={1}
          formik={formik}
        />
        {formik.values.employeeCount >= 70 && (
        <ListItem>
          Given your business's size, we recommend that you contact as after
          registration: help@greenlightready.com
        </ListItem>
        )}
        {/* <FormikInput
          label={t({ id: 'Forms.email_optional', message: 'Email (Optional)' })}
          name="email"
          type="email"
          formik={formik}
        />
        <FormikInput
          label={t({ id: 'Forms.phone_number_optional', message: 'Phone Number (Optional)' })}
          name="phoneNumber"
          type="tel"
          formik={formik}
        /> */}
      </List>
    </>
  )
}

function LocationNotificationsBlock({ formik }: { formik: FormikInstance<any>}) {
  return (
    <Block>
      <BlockTitle>
        <Trans id="NotificationsPage.daily_reminders_title">
          Daily Reminders
        </Trans>
      </BlockTitle>
      <p>
        <Trans id="LocationsNewPage.days_to_remind_footer">
          We send daily reminders to you and your employees to fill out their symptom surveys. We recommend that they fill them out daily.
          After employees sign up, they can change the time and days they're notified.
        </Trans>
      </p>
      <List accordionList form onSubmit={formik.handleSubmit} noHairlines>
        <ListItem
          title={t({ id: 'LocationsNewPage.time_to_remind', message: 'What time would you like send survey reminders?' })}
        />
        <ListItemRow>
          <ListItemCell>
            <FormikInput name="dailyReminderHour" label="Hour" type="number" min="1" max="12" formik={formik} />
          </ListItemCell>
          <ListItemCell>

            <FormikInput
              name="dailyReminderAMPM"
              label="AM/PM"
              type="select"
              formik={formik}
            >
              <option value="am">AM</option>
              <option value="pm">PM</option>
            </FormikInput>

          </ListItemCell>
        </ListItemRow>
        <List style={{ marginTop: 0 }}>
          <ListItem
            title={t({ id: 'LocationsNewPage.days_to_remind', message: 'What days would you like send survey reminders?' })}
          />
          <FormikItem
            title={t({ id: 'Weekday.monday', message: 'Monday' })}
            name="remindMon"
            checkbox
            formik={formik}
          />
          <FormikItem
            title={t({ id: 'Weekday.tuesday', message: 'Tuesday' })}
            name="remindTue"
            checkbox
            formik={formik}
          />
          <FormikItem
            title={t({ id: 'Weekday.wednesday', message: 'Wednesday' })}
            name="remindWed"
            checkbox
            formik={formik}
          />
          <FormikItem
            title={t({ id: 'Weekday.thursday', message: 'Thursday' })}
            name="remindThu"
            checkbox
            formik={formik}
          />
          <FormikItem
            title={t({ id: 'Weekday.friday', message: 'Friday' })}
            name="remindFri"
            checkbox
            formik={formik}
          />
          <FormikItem
            title={t({ id: 'Weekday.saturday', message: 'Saturday' })}
            name="remindSat"
            checkbox
            formik={formik}
          />
          <FormikItem
            title={t({ id: 'Weekday.sunday', message: 'Sunday' })}
            name="remindSun"
            checkbox
            formik={formik}
          />
        </List>
      </List>
    </Block>
  )
}
