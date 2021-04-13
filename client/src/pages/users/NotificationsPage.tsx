import { useFormik, FormikProvider } from 'formik'
import FormikInput from 'src/components/FormikInput'
import FormikItem from 'src/components/FormikItem'

import {
  Block,
  BlockTitle,
  Button,
  f7,
  List,
  ListItem,
  ListItemCell,
  ListItemRow,
  Navbar,
  Page,
} from 'framework7-react'
import React, { useGlobal } from 'reactn'
import { UserSettings } from 'src/models'
import { F7Props } from 'src/types'
import { assertNotNull } from 'src/helpers/util'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { updateUserSettings } from 'src/api'
import { reloadCurrentUser } from 'src/helpers/global'
import { DailyReminderType } from 'src/models/UserSettings'
import Tr, { tr } from 'src/components/Tr'

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
  const submissionHandler = new SubmitHandler(f7)

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
      <Navbar title={tr({ es: 'Notificaciones', en: 'Notifications' })} backLink />
      <Block>
        <BlockTitle>
          <Tr en="Daily Reminders" es="Recordatorios diarios" />
        </BlockTitle>
        <FormikProvider value={formik}>
          <List accordionList form id="EditUserPage-form" onSubmit={formik.handleSubmit} noHairlines>
            <FormikInput
              name="dailyReminderType"
              label={tr({ es: '¿Cómo deberíamos enviarle recordatorios?', en: 'How should we send you reminders?' })}
              type="select"
            >
              {user.mobileNumber && (
              <option value={DailyReminderType.TEXT}>
                {tr({ es: 'Enviar recordatorios por mensaje de texto', en: 'Send Reminders via Text' })}
              </option>
              )}
              {user.email && (
                <option value={DailyReminderType.EMAIL}>
                  {tr({ es: 'Enviar recordatorios por correo electrónico', en: 'Send Reminders via Email' })}
                </option>
              )}
              <option value={DailyReminderType.NONE}>
                {tr({ es: 'Deshabilitar todos los recordatorios', en: 'Disable All Reminders' })}
              </option>
            </FormikInput>
            <FormikItem
              name="overrideLocationReminders"
              title={tr({
                es: 'NotificationsPage.override_location_reminders_title',
                en: 'Override reminders',
              })}
              footer={tr({
                es: 'Establecer mis propias horas de recordatorio',
                en: 'Set my own reminder times',
              })}
              checkbox
            />
            {formik.values.overrideLocationReminders && (
              <ListItemRow>
                <ListItemCell>
                  <FormikInput name="dailyReminderHour" label="Hour" type="number" min="1" max="12" />
                </ListItemCell>
                <ListItemCell>
                  <FormikInput name="dailyReminderAMPM" label="AM/PM" type="select">
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </FormikInput>
                </ListItemCell>
              </ListItemRow>
            )}
            {formik.values.overrideLocationReminders && (
              <List>
                <ListItem
                  title={tr({
                    es: '¿Qué días le gustaría que le recordaran?',
                    en: 'What days would you like to be reminded?',
                  })}
                />
                <FormikItem
                  title={tr({ es: 'Lunes', en: 'Monday' })}
                  name="remindMon"
                  onChange={formik.handleChange}
                  checkbox
                />
                <FormikItem title={tr({ es: 'Martes', en: 'Martes' })} name="remindTue" checkbox />
                <FormikItem title={tr({ es: 'Miercoles', en: 'Wednesday' })} name="remindWed" checkbox />
                <FormikItem title={tr({ es: 'Jueves', en: 'Thursday' })} name="remindThu" checkbox />
                <FormikItem title={tr({ es: 'Viernes', en: 'Friday' })} name="remindFri" checkbox />
                <FormikItem title={tr({ es: 'Sabado', en: 'Saturday' })} name="remindSat" checkbox />
                <FormikItem title={tr({ es: 'Domingo', en: 'Sunday' })} name="remindSun" checkbox />
              </List>
            )}
            <Block>
              <Button type="submit" outline fill>
                <Tr en="Submit" es="Enviar" />
              </Button>
            </Block>
          </List>
        </FormikProvider>
      </Block>
    </Page>
  )
}
