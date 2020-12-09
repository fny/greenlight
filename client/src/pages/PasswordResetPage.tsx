import React, { useEffect, useCallback, useState, useGlobal } from 'reactn'
import { f7, Page, List, Navbar, Block, Button } from 'framework7-react'
import { useFormik, FormikProvider } from 'formik'
import * as Yup from 'yup'

import { defineMessage, t } from '@lingui/macro'
import { F7Props, FunctionComponent } from 'src/types'
import { checkPasswordResetToken, passwordReset } from 'src/api'
import FormikInput from 'src/components/FormikInput'
import SubmissionHandler from 'src/misc/SubmissionHandler'
import logger from 'src/logger'
import { paths } from 'src/routes'

interface PasswordInput {
  password: string
  confirmPassword: string
}

const PasswordResetPage: FunctionComponent<F7Props> = ({ f7route, f7router }) => {
  const [global] = useGlobal()
  const submissionHandler = new SubmissionHandler(f7)
  const { token } = f7route.params
  const cantBeBlankMessage = t({ id: 'Form.error_blank', message: "Can't be blank" })

  const formik = useFormik<PasswordInput>({
    validationSchema: Yup.object<PasswordInput>().shape({
      password: Yup.string().required(cantBeBlankMessage),
      confirmPassword: Yup.string()
        .required(cantBeBlankMessage)
        .test(
          'password-match',
          t({ id: 'PasswordResetPage.password_mistmatch', message: 'Password mistmatch' }),
          function (value) {
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
      submissionHandler.submit(async () => {
        try {
          await passwordReset(token, password)
          f7.dialog.alert(
            global.i18n._(
              defineMessage({
                id: 'PasswordResetPage.password_changed',
                message: 'Your password has been changed.',
              }),
            ),
            global.i18n._(
              defineMessage({ id: 'PasswordResetPage.password_change_success', message: 'Password Change Success' }),
            ),
            () => {
              f7router.navigate(paths.signInPath)
            },
          )
        } catch (e) {
          logger.error(e.response)
          f7.dialog.alert(
            global.i18n._(
              defineMessage({
                id: 'PasswordResetPage.reset_password_failed',
                message: "We couldn't reset the password for that info.",
              }),
            ),
            global.i18n._(
              defineMessage({
                id: 'PasswordResetPage.reset_password_failed_title',
                message: 'Password Reset Failed',
              }),
            ),
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
        global.i18n._(
          defineMessage({
            id: 'PasswordResetPage.invalid_token_description',
            message: 'Token is invalid. Please use the link we sent you.',
          }),
        ),
        global.i18n._(
          defineMessage({
            id: 'PasswordResetPage.invalid_token',
            message: 'Invalid Token',
          }),
        ),
        () => {
          f7router.navigate(paths.rootPath)
        },
      )
    })
  }, [])

  return (
    <Page className="PasswordResetPage" noToolbar noSwipeback loginScreen>
      <Navbar title={t({ id: 'PasswordResetPage.title', message: 'Reset Password' })} />
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
            label={t({ id: 'PasswordResetPage.password', message: 'Password' })}
            type="password"
            required
          />

          <FormikInput
            name="confirmPassword"
            label={t({ id: 'PasswordResetPage.confirm_password', message: 'Confirm Password' })}
            type="password"
            required
          />

          <Block>
            <Button type="submit" outline fill>
              Request Reset
            </Button>
          </Block>
        </List>
      </FormikProvider>
    </Page>
  )
}

export default PasswordResetPage
