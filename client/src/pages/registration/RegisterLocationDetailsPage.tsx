import {
  Block, BlockTitle, Button, f7, List, ListItemCell, ListItemRow, Page,
} from 'framework7-react'
import React from 'react'
import {
  isBlank, isPresent, upperCaseFirst,
} from 'src/helpers/util'
import { reloadCurrentUser, resetRegistration } from 'src/helpers/global'
import {
  lcPeople,
  lcTrans,
} from 'src/models/Location'

import { dynamicPaths, paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import { FormikProvider, useFormik } from 'formik'
import FormikInput from 'src/components/FormikInput'
import * as Yup from 'yup'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { createLocation } from 'src/api'

import 'src/lib/yup-phone'
import FormikItem from 'src/components/FormikItem'
import Tr, { En, Es, tr } from 'src/components/Tr'
import FakeF7ListItem from 'src/components/FakeF7ListItem'
import EmailSupportLink from 'src/components/EmailSupportLink'

export default function RegisterLocationDetailsPage(props: F7Props): JSX.Element {
  const [registeringLocation] = useGlobal('registeringLocation')
  const [currentUser] = useGlobal('currentUser')

  const submissionHandler = new SubmitHandler(f7)
  const formik = useFormik<LocationSetupInput>({
    validationSchema: schema,
    initialValues: new LocationSetupInput(),
    onSubmit: (values) => {
      submissionHandler.submit(async () => {
        if (formik.dirty) {
          const location = await createLocation({
            ...registeringLocation,
            ...values,
            dailyReminderTime: values.dailyReminderHour + (values.dailyReminderAMPM === 'pm' ? 12 : 0),
          })

          props.f7router.navigate(dynamicPaths.registerLocationConfirmationPath({ locationId: location.id }))
          resetRegistration()
        }
      })
    },
  })

  const ownerCount = currentUser ? currentUser.locationAccounts.filter((x) => x.permissionLevel === 'owner').length : 0
  return (
    <Page className="RegisterLocationPages">
      <Block>
        <h1>
          <Tr>
            <En>
              Set up your {lcTrans(registeringLocation.category)}.
            </En>
            <Es>
              Configura su {lcTrans(registeringLocation.category)}.
            </Es>
          </Tr>
        </h1>
        <small>
          <Tr
            en={`You're almost done registering ${registeringLocation.name}!`}
            es={`¡Está casi terminando de registrar ${registeringLocation.name}!`}
          />
        </small>
      </Block>
      <FormikProvider value={formik}>
        <List
          form
          onSubmit={(e) => {
            e.preventDefault()
            formik.handleSubmit(e)
          }}
        >
          {ownerCount > 0 && (
            <Block>
              <small>
                <Tr>
                  <En>
                    You already have registered {ownerCount} locations. If you're having trouble with access send us an email: <EmailSupportLink />
                  </En>
                  <Es>
                    Ya tienes ubicaciones de {ownerCount} registradas. Si tiene problemas con el acceso, envíenos un correo electrónico: <EmailSupportLink />
                  </Es>
                </Tr>
              </small>
            </Block>
          )}

          <Block>
            <BlockTitle>
              Your {upperCaseFirst(lcTrans(registeringLocation.category))}'s Link
            </BlockTitle>
            <List noHairlines style={{ margin: 0 }}>
              <p>
                Create a custom link that {lcPeople(registeringLocation.category)} associated with your
                {lcTrans(registeringLocation.category)} can visit to register for Greenlight.
              </p>
              <FormikInput
                label={
                  tr({ en: 'Customize Your Greenlight URL', es: 'Personaliza su URL de Greenlight' })
                }
                name="permalink"
                info={tr({ en: 'Lowercase letters, numbers, and dashes only.', es: 'Solo letras minúsculas, números y guiones.' })}
                onFocus={(e) => {
                  e.target.value = 'glit.me/go/example'
                }}
                type="text"
                floatingLabel
              />
              {isPresent(formik.values.permalink) && isBlank(formik.errors.permalink)
              && (
              <p>
                <Tr>
                  <En>
                    Users can register for your
                    {' '}
                    {lcTrans(registeringLocation.category)} by visiting
                    {' '}
                    <br />
                    <b>glit.me/go/{formik.values.permalink}</b>
                  </En>
                  <Es>
                    Los usuarios pueden registrarse para su
                    {' '}
                    {lcTrans(registeringLocation.category)} visitando
                    {' '}
                    <br />
                    <b>glit.me/go/{formik.values.permalink}</b>
                  </Es>
                </Tr>
              </p>
              )}
            </List>
          </Block>
          <Block>
            <BlockTitle>
              <Tr
                en="Daily Check Ins"
                es="Encuestas Diarias"
              />
            </BlockTitle>
            <p>
              <Tr>
                <En>
                  We send health check in surveys to your
                  {' '}
                  {lcPeople(registeringLocation.category)}
                  {' '}
                  so you can know if they are well.
                </En>
                <Es>
                  Enviamos enceustas de salud a sus
                  {' '}
                  {lcPeople(registeringLocation.category)}
                  {' '}
                  para que sepa si están bien.
                </Es>
              </Tr>
            </p>
            <List accordionList noHairlines>
              <FormikItem
                title={tr({ en: 'Enable reminders', es: 'Activar recordatorios' })}
                name="remindersEnabled"
                checkbox
              />
              {
                    formik.values.remindersEnabled && (
                      <FakeF7ListItem>
                        <p>
                          {tr({ en: 'What time would you like send reminders?', es: '¿A qué hora le gustaría enviar recordatorios?' })}
                        </p>
                        <ListItemRow>
                          <ListItemCell>
                            <FormikInput name="dailyReminderHour" label={tr({ en: 'Hour', es: 'Hora' })} type="number" min="1" max="12" />
                          </ListItemCell>
                          <ListItemCell>
                            <FormikInput name="dailyReminderAMPM" label="AM/PM" type="select">
                              <option value="am">AM</option>
                              <option value="pm">PM</option>
                            </FormikInput>
                          </ListItemCell>
                        </ListItemRow>
                        <FakeF7ListItem>
                          <p>
                            <Tr
                              en="What days would you like send reminders?"
                              es="¿Qué días le gustaría enviar recordatorios?"
                            />
                          </p>
                          <FormikItem
                            title={tr({ en: 'Monday', es: 'Lunes' })}
                            name="remindMon"
                            checkbox
                          />
                          <FormikItem
                            title={tr({ en: 'Tuesday', es: 'Martes' })}
                            name="remindTue"
                            checkbox
                          />
                          <FormikItem
                            title={tr({ en: 'Wednesday', es: 'Miercoles' })}
                            name="remindWed"
                            checkbox
                          />
                          <FormikItem
                            title={tr({ en: 'Thursday', es: 'Jueves' })}
                            name="remindThu"
                            checkbox
                          />
                          <FormikItem
                            title={tr({ en: 'Friday', es: 'Viernes' })}
                            name="remindFri"
                            checkbox
                          />
                          <FormikItem
                            title={tr({ en: 'Saturday', es: 'Sábado' })}
                            name="remindSat"
                            checkbox
                          />
                          <FormikItem
                            title={tr({ en: 'Sunday', es: 'Domingo' })}
                            name="remindSun"
                            checkbox
                          />
                        </FakeF7ListItem>

                      </FakeF7ListItem>
                    )
              }

            </List>
          </Block>
          <Block>
            <Button fill type="submit">
              <Tr
                en={`Create Your ${upperCaseFirst(lcTrans(registeringLocation.category))}`}
                es={`Crear Su ${upperCaseFirst(lcTrans(registeringLocation.category))}`}
              />
            </Button>
          </Block>
        </List>
      </FormikProvider>
    </Page>
  )
}

class LocationSetupInput {
  permalink: string = ''

  dailyReminderHour = 8

  dailyReminderAMPM: 'am' | 'pm' = 'am'

  remindMon = true

  remindTue = true

  remindWed = true

  remindThu = true

  remindFri = true

  remindSat = true

  remindSun = true

  remindersEnabled = true

  monitoringEnabled = true
}

const schema = Yup.object<LocationSetupInput>().shape({
  permalink: Yup.string()
    .matches(/^[a-z0-9-]+$/, {
      message: tr({
        en: 'only lowercase letters, dashes for spaces, and numbers',
        es: 'solo letras minúsculas, guiones para espacios y números',
      }),
    })
    .min(3)
    .required(tr({ en: "Can't be blank", es: 'No puede quedar vacío' })),
})
