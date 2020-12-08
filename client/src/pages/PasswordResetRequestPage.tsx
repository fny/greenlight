import React, { createRef, useCallback, useState, useGlobal } from 'reactn'
import { f7, Page, List, Navbar, Block, Button } from 'framework7-react'

import { defineMessage, Trans, t } from '@lingui/macro'
import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import { F7Props, FunctionComponent } from 'src/types'
import { passwordResetRequest } from 'src/api'
import { assertNotNull } from 'src/util'
import SubmissionHandler from 'src/misc/SubmissionHandler'
import logger from 'src/logger'

const PasswordResetRequestPage: FunctionComponent<F7Props> = ({}) => {
  const [emailOrMobile, setEmailOrMobile] = useState('')
  const emailOrMobileRef = createRef<EmailOrPhoneListInput>()
  const [global] = useGlobal()

  const submissionHandler = new SubmissionHandler(f7)

  const sendRequest = useCallback(
    (e) => {
      e.preventDefault()

      submissionHandler.submit(async () => {
        const input = emailOrMobileRef?.current

        assertNotNull(input)

        const isValid = input.validate(emailOrMobile || '')
        if (!isValid) return
        try {
          await passwordResetRequest(emailOrMobile)
          const alertTitle = global.i18n._(
            defineMessage({ id: 'PasswordResetRequestPage.request_sent', message: 'Password Reset Request Sent' }),
          )
          if (emailOrMobile.includes('@')) {
            f7.dialog.alert(
              global.i18n._(
                defineMessage({
                  id: 'PasswordResetRequestPage.will_get_email',
                  message: 'You should receive an email shortly with a password reset page in link.',
                }),
              ),
              alertTitle,
            )
          } else {
            f7.dialog.alert(
              global.i18n._(
                defineMessage({
                  id: 'PasswordResetRequestPage.will_get_text',
                  message: 'You should receive a text shortly with a password reset page in link.',
                }),
              ),
              alertTitle,
            )
          }
        } catch (e) {
          logger.error(e.response)
          f7.dialog.alert(
            global.i18n._(
              defineMessage({
                id: 'PasswordResetRequestPage.failed_setup',
                message: "We couldn't set up a password reset request for that info.",
              }),
            ),
            global.i18n._(
              defineMessage({
                id: 'PasswordResetRequestPage.request_failed',
                message: 'Password Reset Request Failed',
              }),
            ),
          )
        }
      })
    },
    [emailOrMobile],
  )

  return (
    <Page className="PasswordResetRequestPage" noToolbar noSwipeback loginScreen>
      <Navbar title={t({ id: 'PasswordResetRequestPage.title', message: 'Forgot Password' })} />
      <List form onSubmit={sendRequest}>
        <Block>
          <Trans id="PasswordResetRequestPage.instructions">
            Enter your email or mobile number, and we'll send you a link to reset your password.
          </Trans>
        </Block>
        <li>
          <EmailOrPhoneListInput
            value={emailOrMobile}
            ref={emailOrMobileRef}
            onInput={(e) => setEmailOrMobile(e.target.value)}
          />
        </li>
        <Block>
          <Button type="submit" outline fill>
            Request Reset
          </Button>
        </Block>
      </List>
    </Page>
  )
}

export default PasswordResetRequestPage
