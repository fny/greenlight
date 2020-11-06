import React, { useGlobal, useMemo } from 'reactn'
import { Page, Navbar, f7, List, ListInput, Block, Button, ListItem } from 'framework7-react'
import { Router } from 'framework7/modules/router/router'

import { defineMessage, t, Trans } from '@lingui/macro'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'

import { FunctionComponent } from '../types'

interface Props {
  f7route: Router.Route
}

const EditUserPage: FunctionComponent<Props> = ({ f7route }) => {
  const [global] = useGlobal()
  const user = useMemo(() => global.currentUser, [global])

  const { userId, childId } = useMemo(() => f7route.params, [])
  const userInfo = useMemo(() => (childId ? user?.children.find((child) => child.id === childId) : user), [
    user,
    childId,
  ])
  const isParent = useMemo(() => childId === undefined, [childId])

  const formik = useFormik<EditUserInput>({
    validationSchema: schema,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    enableReinitialize: true,
    initialValues: {
      firstName: userInfo?.firstName || '',
      lastName: userInfo?.lastName || '',
      email: userInfo?.email || '',
      mobileNumber: userInfo?.mobileNumber || '',
      zipCode: userInfo?.zipCode || '',
      birthDate: userInfo?.birthDate || '',
      physicianName: userInfo?.physicianName || '',
      physicianPhoneNumber: userInfo?.physicianPhoneNumber || '',
      needHelp: false,
    },
    onSubmit: (value) => {
      console.log('submit', value)
    },
  })

  return (
    <Page>
      <Navbar
        title={global.i18n._(
          defineMessage({
            id: 'EditUserPage.title',
            message: isParent ? 'Your Information' : t`${userInfo?.firstName}'s Information`,
          }),
        )}
        backLink="Back"
        sliding
      />

      <FormikProvider value={formik}>
        <List form id="sign-in-form">
          <ListInput
            label={global.i18n._(defineMessage({ id: 'EditUserPage.first_name_label', message: 'First Name' }))}
            validateOnBlur
            value={formik.values.firstName}
            required
            onInput={(e) =>
              formik.handleChange({
                target: {
                  name: 'firstName',
                  value: e.target.value,
                },
              })
            }
            errorMessage={global.i18n._(
              defineMessage({ id: 'EditUserPage.first_name_missing', message: 'Please enter your first name.' }),
            )}
          />
          <ListInput
            label={global.i18n._(defineMessage({ id: 'EditUserPage.last_name_label', message: 'Last Name' }))}
            validateOnBlur
            value={formik.values.lastName}
            required
            onInput={(e) =>
              formik.handleChange({
                target: {
                  name: 'lastName',
                  value: e.target.value,
                },
              })
            }
            errorMessage={global.i18n._(
              defineMessage({ id: 'EditUserPage.last_name_missing', message: 'Please enter your last name.' }),
            )}
          />

          {isParent && (
            <ListInput
              label={global.i18n._(defineMessage({ id: 'EditUserPage.email_label', message: 'Email' }))}
              validateOnBlur
              value={formik.values.email}
              onInput={(e) =>
                formik.handleChange({
                  target: {
                    name: 'email',
                    value: e.target.value,
                  },
                })
              }
              readonly
            />
          )}
          {isParent && (
            <ListInput
              label={global.i18n._(defineMessage({ id: 'EditUserPage.mobile_number_label', message: 'Mobile Number' }))}
              validateOnBlur
              value={formik.values.mobileNumber}
              onInput={(e) =>
                formik.handleChange({
                  target: {
                    name: 'mobileNumber',
                    value: e.target.value,
                  },
                })
              }
              readonly
            />
          )}

          <ListInput
            label={global.i18n._(defineMessage({ id: 'EditUserPage.zip_code_label', message: 'Zip Code' }))}
            validateOnBlur
            value={formik.values.zipCode}
            onInput={(e) =>
              formik.handleChange({
                target: {
                  name: 'zipCode',
                  value: e.target.value,
                },
              })
            }
          />

          <ListInput
            label={global.i18n._(defineMessage({ id: 'EditUserPage.date_of_birth_label', message: 'Date of Birth' }))}
            validateOnBlur
            value={formik.values.birthDate}
            type="date"
            onInput={(e) =>
              formik.handleChange({
                target: {
                  name: 'birthDate',
                  value: e.target.value,
                },
              })
            }
          />

          <ListInput
            label={global.i18n._(
              defineMessage({
                id: 'EditUserPage.primary_care_physician_name_label',
                message: 'Primary Care Physician Name',
              }),
            )}
            validateOnBlur
            value={formik.values.physicianName}
            onInput={(e) =>
              formik.handleChange({
                target: {
                  name: 'physicianName',
                  value: e.target.value,
                },
              })
            }
          />

          <ListInput
            label={global.i18n._(
              defineMessage({
                id: 'EditUserPage.primary_care_physician_phone_number_label',
                message: 'Primary Care Physician Phone Number',
              }),
            )}
            validateOnBlur
            value={formik.values.physicianPhoneNumber}
            type="tel"
            onInput={(e) =>
              formik.handleChange({
                target: {
                  name: 'physicianPhoneNumber',
                  value: e.target.value,
                },
              })
            }
          />

          <ListItem
            checkbox
            title={global.i18n._(
              defineMessage({
                id: 'EditUserPage.need_help_finding_physician',
                message: 'Need help finding a physician?',
              }),
            )}
            checked={formik.values.needHelp}
            onChange={(e) =>
              formik.handleChange({
                target: {
                  name: 'needHelp',
                  value: e.target.checked,
                },
              })
            }
          />

          <Block>
            <Button
              outline
              fill
              onClick={(e) => {
                e.preventDefault()
                formik.submitForm()
              }}
            >
              <Trans id="EditUserPage.submit">Submit</Trans>
            </Button>
          </Block>
        </List>
      </FormikProvider>
    </Page>
  )
}

interface EditUserInput {
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
  zipCode: string
  birthDate: string
  physicianName: string
  physicianPhoneNumber: string
  needHelp: boolean
}

const schema = Yup.object<EditUserInput>().shape({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
})

export default EditUserPage
