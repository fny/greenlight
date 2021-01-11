import { t, Trans } from '@lingui/macro'
import {
  Block, BlockTitle, Button, f7, List, ListItem, ListItemCell, ListItemRow, Page,
} from 'framework7-react'
import React, { useState } from 'react'
import { isBlank, isPresent, upperCaseFirst } from 'src/helpers/util'
import {
import { reloadCurrentUser } from 'src/helpers/global'
import {
  lcTrans, LocationCategories, LOCATION_CATEGORIES,
} from 'src/models/Location'

import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props, FormikInstance } from 'src/types'
import { FormikProvider, useFormik } from 'formik'
import FormikInput from 'src/components/FormikInput'
import * as Yup from 'yup'
import { User } from 'src/models'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { createLocation } from 'src/api'

import { Router } from 'framework7/modules/router/router'
import 'src/lib/yup-phone'
import FormikItem from 'src/components/FormikItem'
import { SmartSelect } from 'framework7/components/smart-select/smart-select'

class State {
  locationCategory: LocationCategories = LocationCategories.COMMUNITY
}

export default function RegisterLocationDetailsPage(props: F7Props): JSX.Element {
  const [registeringLocation] = useGlobal('registeringLocation')
  // FIXME: Why is this not picking up the type?
  const [currentUser] = useGlobal('currentUser') as [User, any]
  const [state, setState] = useState(new State())

  const submissionHandler = new SubmitHandler(f7)
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
          props.f7router.navigate(paths.registerLocationConfirmationPath)
        }
      })
    },
  })

  const ownerCount = currentUser ? currentUser.locationAccounts.filter((x) => x.permissionLevel === 'owner').length : 0
  const category = registeringLocation.category || state.locationCategory
  return (
    <Page className="RegisterLocationWelcomePage">
      <style>
        {
          `
          .RegisterLocationWelcomePage .fill-in-the-blank {
            display: inline-block;
            border-bottom: 1px dashed black;
            text-align: center;
            color: var(--gl-green);
          }
          .RegisterLocationWelcomePage .category-select {
            cursor: pointer;
          }
          .RegisterLocationWelcomePage .introduction {
            font-size: 1.5rem;
          }
          .RegisterLocationWelcomePage .has-error {
            color: red;
            border-bottom: 1px dashed red;
          }
          .RegisterLocationWelcomePage .has-error::placeholder {
            color: red;
          }
          `
        }
      </style>
      <Block>
        <h1>
          Tell us more about your<br />
          {category}.
        </h1>
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
                <Trans id="LocationsNewPage.school_info_title">
                  Your {category}'s Information
                </Trans>
              </BlockTitle>

              <Trans id="LocationsNewPage.school_info_instructions">
                Please fill out the form below with information about your {category}.
              </Trans>

              {ownerCount > 0 && (
              <span>{' '}
                <Trans id="LocationsNewPage.school_info_school_count">
                  Note you already have registered {ownerCount} locations. If you're having trouble with access send us an email: help@greenlightready.com
                </Trans>
              </span>
              )}
              <LocationDetailFields
                formik={formik}
                location={registeringLocation}
                category={category}
                state={state}
                setState={setState}
              />
              <LocationNotificationFields formik={formik} category={category} />
            </Block>
            <Button fill type="submit">
              <Trans id="SchoolLocationForm.create_location">Create Your {upperCaseFirst(lcTrans(category))}</Trans>
            </Button>
          </List>
        </FormikProvider>
      </Block>
    </Page>
  )
}

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
type Props = { location?: Location, f7router: Router.Router, category?: string }

function LocationDetailFields({
  formik, location, category, state, setState,
}: { formik: FormikInstance<any>, location: GRegisteringLocation, category: LocationCategories, state: State, setState: React.Dispatch<React.SetStateAction<State>>}) {
  return (
    <>
      <List noHairlines>
        { isBlank(location.category) && (
        <ListItem
          title="I'm using Greenlight for a..."
          smartSelect
          smartSelectParams={{
            openIn: 'sheet',
            routableModals: false,
            on: {
              change(ss: SmartSelect.SmartSelect) {
                console.log(ss.getValue(), ss)
                setState({ ...state, locationCategory: ss.getValue() as LocationCategories })
              },
            },
          }}
        >
          <select
            name="category"
            defaultValue="community"
          >
            {
              LOCATION_CATEGORIES.map((c) => <option key={c} value={c}>{upperCaseFirst(lcTrans(c))}</option>)
            }
          </select>
        </ListItem>
        )}
        <FormikInput
          label={
            t({ id: 'LocationDetailsForm.business_name', message: `${upperCaseFirst(category)} Name` })
          }
          name="name"
          type="text"
          floatingLabel
        />
        <FormikInput
          label={
            t({ id: 'LocationDetailsForm.school_id', message: 'Customize Your Greenlight URL (glit.me/go/your-input)' })
          }
          name="permalink"
          info="Lowercase letters, numbers, and dashes only."
          onFocus={(e) => {
            e.target.value = 'glit.me/go/asf'
          }}
          type="text"
          floatingLabel
        />
        {isPresent(formik.values.permalink) && isBlank(formik.errors.permalink)
        && (
        <ListItem>
          <Trans id="LocationDetailsForm.registration">
            Users will be able to register for your {upperCaseFirst(category)} by visiting:{' '}
            glit.me/go/{formik.values.permalink}
          </Trans>
        </ListItem>
        )}
        { isBlank(location.zipCode) && (
        <FormikInput
          label={t({ id: 'LocationDetailsForm.zip_code', message: 'Zip Code' })}
          name="zipCode"
          type="text"
          floatingLabel
        />
        )}

        <FormikInput
          label={t({ id: 'LocationDetailsForm.number_of_users', message: 'How many people will use Greenlight?' })}
          name="employeeCount"
          type="number"
          min={1}
          floatingLabel
        />
      </List>
    </>
  )
}

function LocationNotificationFields({ formik, category }: { formik: FormikInstance<any>, category: LocationCategories}) {
  return (
    <Block>
      <BlockTitle>
        <Trans id="LocationNotificationsForm.daily_reminders_title">
          Daily Reminders
        </Trans>
      </BlockTitle>
      <p>
        <Trans id="SchoolNotificationsForm.days_to_remind_footer">
          We send daily reminders to your community to fill out their daily check-ins. Set the default time below. After everyone signs up, they can change the time and days they're notified.
        </Trans>

      </p>
      <List accordionList noHairlines>
        <p>
          {t({ id: 'LocationNotificationsForm.time_to_remind', message: 'What time would you like send reminders?' })}
        </p>
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
          <p>
            {t({ id: 'LocationNotificationsForm.days_to_remind', message: 'What days would you like send survey reminders?' })}
          </p>
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
