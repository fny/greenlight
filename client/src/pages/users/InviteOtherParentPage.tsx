import { useRef, useCallback } from 'react'
import { FormikProvider, useFormik, yupToFormErrors } from 'formik'
import { Block, BlockTitle, Button, f7, List, ListItem, Navbar, Page } from 'framework7-react'
import { getEmailOrMobileTaken, inviteAnotherParent, store } from 'src/api'
import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import FormikInput from 'src/components/FormikInput'
import LoadingUserContent from 'src/components/LoadingUserContent'
import Tr, { tr } from 'src/components/Tr'
import { assertNotNull, assertNotUndefined } from 'src/helpers/util'
import { F7Props } from 'src/types'
import * as Yup from 'yup'
import { values } from 'lodash'
import SubmitHandler from 'src/helpers/SubmitHandler'

export default function InviteOtherParentPage(props: F7Props) {
  const { userId } = props.f7route.params
  assertNotUndefined(userId)

  const emailOrMobileRef = useRef<EmailOrPhoneListInput>(null)
  const submitHandler = new SubmitHandler(f7)

  const handleSubmit = useCallback((values: UserForm) => {
    submitHandler.submit(() => {
      return inviteAnotherParent(values).then(() => {
        f7.dialog.alert(
          tr({
            en: `Thank you! An account has been created for ${values.firstName}. They can access their account by resetting their password or requesting a magic sign-in link. They should receive an email with these instructions shortly too.`,
            es: `¡Gracias! Se ha creado una cuenta para ${values.firstName}. Pueden acceder a su cuenta restableciendo su contraseña o solicitando un enlace mágico de inicio de sesión. También deberían recibir un correo electrónico con estas instrucciones en breve.`,
            reviewTrans: true,
          }),
        )
      })
    })
  }, [])

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
    onSubmit: async (values) => {
      if (!emailOrMobileRef.current?.validate(values.emailOrMobile)) {
        return
      }

      let emailOrMobileTaken: boolean = false

      await submitHandler.submit(async () => {
        emailOrMobileTaken = await getEmailOrMobileTaken(values.emailOrMobile)
      })

      if (emailOrMobileTaken) {
        let message: string
        if (values.emailOrMobile.includes('@')) {
          message = tr({
            en:
              'The email you provided is already in use. By continuing, you will allow the person with this account to access your children',
            es:
              'El correo electrónico que proporcionó ya está en uso. Al continuar, permitirá que la persona con esta cuenta acceda a sus hijos.',
            reviewTrans: true,
          })
        } else {
          message = tr({
            en:
              'The mobile number you provided is already in use. By continuing, you will allow the person with this account to access your children',
            es:
              'El número de móvil que proporcionó ya está en uso. Al continuar, permitirá que la persona con esta cuenta acceda a sus hijos.',
            reviewTrans: true,
          })
        }

        f7.dialog.confirm(
          message,
          tr({ en: 'Account already exists', es: 'la cuenta ya existe', reviewTrans: true }),
          () => {
            handleSubmit(values)
          },
          () => {},
        )
      } else {
        handleSubmit(values)
      }
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
