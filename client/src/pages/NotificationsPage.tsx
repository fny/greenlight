import { t, Trans } from '@lingui/macro'
import { Formik, useFormik } from 'formik'
import FormikInput from 'src/components/FormikInput'
import FormikItem from 'src/components/FormikItem'
import * as Yup from 'yup'

import {
  AccordionContent, Block, BlockTitle, f7, List, ListInput, ListItem, Navbar, Page,
} from 'framework7-react'
import React, { useGlobal } from 'reactn'
import { UserSettings } from 'src/models'
import { F7Props } from 'src/types'
import { assertNotNull } from 'src/util'
import SubmissionHandler from 'src/misc/SubmissionHandler'
import { updateUserSettings } from 'src/api'
import { reloadCurrentUser } from 'src/initializers/providers'

const submissionHandler = new SubmissionHandler(f7)

export default function NotificationsPage(props: F7Props) {
  const [user] = useGlobal('currentUser')
  assertNotNull(user)
  const settings = user.settingsReified()

  const formik = useFormik<Partial<UserSettings>>({
    validationSchema: Yup.object<Partial<UserSettings>>().shape({
      firstName: Yup.string().required(),
      lastName: Yup.string().required(),
      zipCode: Yup.string().matches(/^\d{5}$/, {
        excludeEmptyString: true,
        message: t({ id: 'EditUserPage.invalid_zip_code', message: 'Zip code should be 5 digits' }),
      }),
    }),
    validateOnChange: true,
    initialValues: {
      dailyReminderType: settings.dailyReminderType,
      overrideLocationReminders: settings.overrideLocationReminders,
      dailyReminderTime: settings.dailyReminderTime,
      remindMon: settings.remindMon,
      remindTue: settings.remindTue,
      remindWed: settings.remindWed,
      remindThu: settings.remindThu,
      remindFri: settings.remindFri,
      remindSat: settings.remindSat,
      remindSun: settings.remindSun,
    },
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          await updateUserSettings(user, {
            ...values,
          })
          await reloadCurrentUser()
        }
        props.f7router.back()
      })
    },
  })

  return (
    <Page>
      <Navbar
        title={t({ id: 'NotificationsPage.title', message: 'Notifications' })}
        backLink
      />
      <Block>
        <BlockTitle>
          <Trans id="NotificationsPage.daily_reminders_title">
            Daily Reminders
          </Trans>
        </BlockTitle>
        <List accordionList>
          <FormikInput
            name="dailyReminderType"
            label="How to Send Reminders"
            type="select"
            placeholder="Please choose..."
            formik={formik}
          >
            <option value="text">Send Reminders via Text</option>
            <option value="email">Send Reminders via Email</option>
            {/* <option value="push">Send Reminders via Push Notification</option> */}
            <option value="none">Disable All Reminders</option>
          </FormikInput>
          <ListItem checkbox title="Set my own reminder times" footer="This will override the reminder times set by your locations." />

          <ListInput type="time" />
          <ListItem accordionItem title="Days of the Week to Receive Reminders">
            <AccordionContent>
              <List>
                <FormikItem
                  title={t({ id: 'Weekday.monday', message: 'Monday' })}
                  name="remindMon"
                  checkbox
                  formik={formik}
                />
                <FormikItem
                  title={t({ id: 'Weekday.monday', message: 'Monday' })}
                  name="remindMon"
                  onChange={formik.handleChange}
                  checkbox
                  formik={formik}
                />
                <FormikItem
                  title={t({ id: 'Weekday.tuesday', message: 'Tuesday' })}
                  name="remindTues"
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
            </AccordionContent>
          </ListItem>

        </List>
      </Block>
    </Page>
  )
}
