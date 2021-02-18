import { useRef } from 'react'
import { FormikProvider, useFormik, yupToFormErrors } from 'formik'
import { Block, BlockTitle, Button, List, ListItem, Navbar, Page } from 'framework7-react'
import { store } from 'src/api'
import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import FormikInput from 'src/components/FormikInput'
import LoadingUserContent from 'src/components/LoadingUserContent'
import Tr, { tr } from 'src/components/Tr'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { F7Props } from 'src/types'
import * as Yup from 'yup'
import { values } from 'lodash'

export default function InviteOtherParentPage(props: F7Props) {
  const { userId } = props.f7route.params
  assertNotUndefined(userId)

  const emailOrMobileRef = useRef<EmailOrPhoneListInput>(null)
  const formik = useFormik<UserForm>({
    validationSchema: Yup.object<UserForm>().shape({
      firstName: Yup.string()
        .required()
        .label(tr({ en: 'First Name', es: 'Primero' })),
      lastName: Yup.string()
        .required()
        .label(tr({ en: 'Last Name', es: 'Apellido' })),
      emailOrMobile: Yup.string().required(),
    }),
    initialValues: new UserForm(),
    onSubmit: (values) => {
      if (!emailOrMobileRef.current?.validate(values.emailOrMobile)) {
        return
      }
      console.log('submit', values)
    },
  })

  return (
    <Page>
      <Navbar
        title={tr({
          en: 'Invite Another Parent',
          es: 'Invitar a otra madre',
          reviewTrans: true,
        })}
        backLink
      />
      <LoadingUserContent
        userId={userId}
        content={(state) => {
          const { user } = state
          assertNotNull(user)

          return (
            <Block>
              <BlockTitle>
                <Tr
                  en="Invite another parent who is associated with your children"
                  es="Invite a otro padre que esté asociado con sus hijos"
                  reviewTrans
                />
              </BlockTitle>

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
                    label={tr({ en: 'First Name', es: 'Primero' })}
                    name="firstName"
                    type="text"
                    floatingLabel
                  />
                  <FormikInput
                    label={tr({ en: 'Last Name', es: 'Apellido' })}
                    name="lastName"
                    type="text"
                    floatingLabel
                  />

                  <EmailOrPhoneListInput
                    value={formik.values.emailOrMobile}
                    ref={emailOrMobileRef}
                    onInput={(e) => {
                      formik.setFieldValue('emailOrMobile', e.target.value)
                    }}
                  />

                  <BlockTitle>
                    <Tr en="Select children you want to share" es="" reviewTrans />
                  </BlockTitle>
                  <List>
                    {user.children.map((child, index) => (
                      <ListItem
                        checkbox
                        key={index}
                        title={`${child.firstName} ${child.lastName}`}
                        checked={formik.values.children.includes(child.id)}
                        onClick={(e) => {
                          e.preventDefault()

                          if (formik.values.children.includes(child.id)) {
                            formik.setFieldValue(
                              'children',
                              formik.values.children.filter((id) => id !== child.id),
                            )
                          } else {
                            formik.setFieldValue('children', [...formik.values.children, child.id])
                          }
                        }}
                      />
                    ))}
                  </List>

                  <Button style={{ marginTop: '1rem' }} type="submit" outline fill>
                    <Tr en="Invite" es="Invitación" reviewTrans />
                  </Button>
                </List>
              </FormikProvider>
            </Block>
          )
        }}
      />
    </Page>
  )
}

class UserForm {
  firstName: string = ''

  lastName: string = ''

  emailOrMobile: string = ''

  children: Array<string> = []
}
