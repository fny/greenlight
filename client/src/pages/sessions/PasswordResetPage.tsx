import React, {
  useEffect, useCallback,
} from 'reactn'
import {
  f7, Page, List, Navbar, Block, Button,
} from 'framework7-react'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'

import { F7Props } from 'src/types'
import { checkPasswordResetToken, passwordReset } from 'src/api'
import FormikInput from 'src/components/FormikInput'
import SubmitHandler from 'src/helpers/SubmitHandler'
import logger from 'src/helpers/logger'
import { paths } from 'src/config/routes'
import { assertNotUndefined } from 'src/helpers/util'
import Tr, { tr } from 'src/components/Tr'

interface PasswordInput {
  password: string
  confirmPassword: string
}

export default function PasswordResetPage({ f7route, f7router }: F7Props): JSX.Element {
  const submitHandler = new SubmitHandler(f7)
  const { token } = f7route.params
  assertNotUndefined(token)
  const cantBeBlankMessage = tr({ en: "Can't be blank", es: 'No puede estar en blanco' })

  const formik = useFormik<PasswordInput>({
    validationSchema: Yup.object<PasswordInput>().shape({
      password: Yup.string().required(cantBeBlankMessage),
      confirmPassword: Yup.string()
        .required(cantBeBlankMessage)
        .test(
          'password-match',
          tr({
            en: "Passwords don't match",
            es: 'Las contraseñas no son similares',
          }),
          // eslint-disable-next-line func-names
          function (value) {
            // eslint-disable-next-line react/no-this-in-sfc
            return this.parent.password === value
          },
        ),
    }),
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: (values) => {
      sendRequest(values.password)
    },
  })

  const sendRequest = useCallback(
    (password) => {
      submitHandler.submit(async () => {
        try {
          await passwordReset(token, password)
          f7.dialog.alert(
            tr({
              en: 'Your password has been changed.',
              es: 'Su contraseña ha sido cambiada.',
            }),
            tr({ en: 'Password Changed', es: 'Contraseña cambiada' }),
            () => {
              f7router.navigate(paths.signInPath)
            },
          )
        } catch (e) {
          logger.error(e.response)
          f7.dialog.alert(
            tr({
              en: "We couldn't reset the password for that info.",
              es: 'No pudimos restablecer la contraseña para esa información.',
            }),
            tr({
              en: 'Password Reset Failed',
              es: 'Error al restablecer la contraseña',
            }),
          )
        }
      })
    },
    [formik],
  )

  useEffect(() => {
    checkPasswordResetToken(token).catch((e) => {
      logger.error(e.response)

      f7.dialog.alert(
        tr({
          en: 'The link you provided is invalid or has expired. Please try again.',
          es: 'El enlace que proporcionaste no es válido o ha caducado. Inténtalo de nuevo.',
          reviewTrans: true,
        }),
        tr({
          en: 'Invalid Link',
          es: 'Enlace Inválido',
        }),
        () => {
          f7router.navigate(paths.rootPath)
        },
      )
    })
  }, [])

  return (
    <Page className="PasswordResetPage" noToolbar noSwipeback loginScreen>
      <Navbar backLink title={tr({ en: 'Reset Password', es: 'Restablecer la contraseña' })} />
      <Block>
        <Tr
          en="Enter the new password that you would like to use."
          es="Ingrese la nueva contraseña que le gustaría usar."
        />
      </Block>
      <FormikProvider value={formik}>
        <List
          form
          onSubmit={(e) => {
            e.preventDefault()
            formik.submitForm()
          }}
        >
          <FormikInput
            name="password"
            label={tr({ en: 'Password', es: 'Contraseña' })}
            type="password"
            required
          />

          <FormikInput
            name="confirmPassword"
            label={tr({ en: 'Confirm Password', es: 'Confirmar Contraseña' })}
            type="password"
            required
          />

          <Block>
            <Button type="submit" outline fill>
              <Tr
                en="Update Password"
                es="Cambiar la contraseña"
              />
            </Button>
          </Block>
        </List>
      </FormikProvider>
    </Page>
  )
}
