import { t, Trans } from '@lingui/macro'
import { useFormik } from 'formik'
import FormikInput from 'src/components/FormikInput'
import FormikItem from 'src/components/FormikItem'

import {
  Block, BlockTitle, Button, f7, List, ListItem, ListItemCell, ListItemRow, Navbar, Page,
} from 'framework7-react'
import React, { useGlobal } from 'reactn'
import { UserSettings } from 'src/models'
import { F7Props } from 'src/types'
import { assertNotNull } from 'src/util'
import SubmissionHandler from 'src/misc/SubmissionHandler'
import { updateUserSettings } from 'src/api'
import { reloadCurrentUser } from 'src/initializers/providers'
import { DailyReminderType } from 'src/models/UserSettings'

interface NotificationsForm {
  dailyReminderType: DailyReminderType
  overrideLocationReminders: boolean
  dailyReminderHour: number
  dailyReminderAMPM: 'am' | 'pm'
  remindMon: boolean
  remindTue: boolean
  remindWed: boolean
  remindThu: boolean
  remindFri: boolean
  remindSat: boolean
  remindSun: boolean
}

export default function NotificationsPage(props: F7Props) {
  const submissionHandler = new SubmissionHandler(f7)

  const [user] = useGlobal('currentUser')
  assertNotNull(user)
  const settings = user.settingsReified()
  const formik = useFormik<NotificationsForm>({
    validateOnChange: true,
    initialValues: {
      dailyReminderType: settings.dailyReminderType,
      dailyReminderHour: settings.dailyReminderHour(),
      dailyReminderAMPM: settings.dailyReminderAMPM(),
      overrideLocationReminders: settings.overrideLocationReminders,
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
          const valuesToSubmit: Partial<UserSettings> = {
            dailyReminderType: values.dailyReminderType,
            overrideLocationReminders: values.overrideLocationReminders,
            remindMon: values.remindMon,
            remindTue: values.remindTue,
            remindWed: values.remindWed,
            remindThu: values.remindThu,
            remindFri: values.remindFri,
            remindSat: values.remindSat,
            remindSun: values.remindSun,
            dailyReminderTime: values.dailyReminderHour + (values.dailyReminderAMPM === 'pm' ? 12 : 0),
          }

          await updateUserSettings(user, {
            ...valuesToSubmit,
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
        <List accordionList form id="EditUserPage-form" onSubmit={formik.handleSubmit} noHairlines>
          <FormikInput
            name="dailyReminderType"
            label={t({ id: 'NotificationsPage.how_to_remind', message: 'How should we send you reminders?' })}
            type="select"
            formik={formik}
          >
            <option value={DailyReminderType.TEXT}>
              {t({ id: 'DailyReminder.send_via_text', message: 'Send Reminders via Text' })}
            </option>
            {user.email
              && (
              <option value={DailyReminderType.EMAIL}>
                {t({ id: 'DailyReminder.send_via_email', message: 'Send Reminders via Email' })}
              </option>
              )}
            <option value={DailyReminderType.NONE}>
              {t({ id: 'DailyReminder.disable_all', message: 'Disable All Reminders' })}
            </option>
          </FormikInput>
          <FormikItem
            name="overrideLocationReminders"
            title={t({ id: 'NotificationsPage.override_location_reminders_title', message: 'Set my own reminder times' })}
            footer={t({ id: 'NotificationsPage.override_location_reminders_footer', message: 'Set my own reminder times' })}
            formik={formik}
            checkbox
          />
          {formik.values.overrideLocationReminders && (
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
          ) }
          { formik.values.overrideLocationReminders
              && (
                <List>
                  <ListItem title={t({ id: 'NotificationsPage.days_to_remind', message: 'What days would you like to be reminded?' })} />
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
              )}
          <Block>
            <Button type="submit" outline fill>
              <Trans id="Common.submit">Submit</Trans>
            </Button>
          </Block>
        </List>
      </Block>
    </Page>
  )
}