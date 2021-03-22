import React, {
  createRef, useCallback, useState,
} from 'reactn'
import {
  f7, Page, List, Navbar, Block, Button,
} from 'framework7-react'

import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import { F7Props, FunctionComponent } from 'src/types'
import { passwordResetRequest } from 'src/api'
import { assertNotNull } from 'src/helpers/util'
import SubmitHandler from 'src/helpers/SubmitHandler'
import logger from 'src/helpers/logger'
import Tr, { tr } from 'src/components/Tr'
import './SessionsPage.css'
import greenlightLogo from 'src/assets/images/logos/greenlight-banner-logo.svg'

const PasswordResetRequestPage: FunctionComponent<F7Props> = ({}) => {
  const [emailOrMobile, setEmailOrMobile] = useState('')
  const emailOrMobileRef = createRef<EmailOrPhoneListInput>()

  const submitHandler = new SubmitHandler(f7)

  const sendRequest = useCallback(
    (e) => {
      e.preventDefault()

      submitHandler.submit(async () => {
        const input = emailOrMobileRef?.current

        assertNotNull(input)

        const isValid = input.validate(emailOrMobile || '')
        if (!isValid) return
        try {
          await passwordResetRequest(emailOrMobile)
          const alertTitle = tr({
            en: 'Password Reset Request Sent',
            es: 'Solicitud Enviada',
          })

          if (emailOrMobile.includes('@')) {
            f7.dialog.alert(
              tr({
                en: 'You should receive an email shortly with a password reset link.',
                es: 'Recibirá un correo electrónico con un enlace para restablecer la contraseña.',
              }),
              alertTitle,
            )
          } else {
            f7.dialog.alert(
              tr({
                en: 'You should receive a text shortly with a password reset link.',
                es: 'Recibirás un mensaje de texto con un enlace para restablecer la contraseña.',
              }),
              alertTitle,
            )
          }
        } catch (e) {
          logger.error(e.response)
          f7.dialog.alert(
            tr({
              en: "We couldn't create a password reset request for that info.",
              es: 'No pudimos crear un restablecimiento de contraseña para esa información.',
            }),
            tr({
              en: 'Password Reset Failed',
              es: 'Error al restablecer la contraseña',
            }),
          )
        }
      })
    },
    [emailOrMobile],
  )

  return (
    <Page className="PasswordResetRequestPage" noToolbar noSwipeback loginScreen>
      <Navbar title={tr({ en: 'Forgot Password', es: 'Olvidé Mi Contraseña' })} backLink />
      <div className="greenlight-logo">
        <img src={greenlightLogo} alt="Greenlight" />
      </div>
      <List form onSubmit={sendRequest}>
        <Block>
          <Tr
            en="Enter your email or mobile number, and we'll send you a link to reset your password."
            es="Ingrese su correo electrónico o número de teléfono móvil y le enviaremos un enlace para restablecer su contraseña."
          />
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
            <Tr
              en="Request Reset"
              es="Enviar"
            />
          </Button>
          <Block>
          <Tr
            en="Important: If you use a Microsoft hosted email (MSN, Hotmail, Outlook) you may not receive Greenlight emails. Contact help@greenlightready.com for a password."
            es="Importante: si utiliza un correo electrónico alojado en Microsoft (MSN, Hotmail, Outlook), es posible que no reciba ningún correo electrónico de Greenlight. Comuníquese con help@greenlightready.com para obtener una contraseña."
          />
          </Block>
        </Block>
      </List>
    </Page>
  )
}

export default PasswordResetRequestPage
