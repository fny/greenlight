import React from 'reactn'
import {
  Page,
  List,
  Navbar,
  Block,
  Button,
  ListItem,
} from 'framework7-react'

import EmailOrPhoneListInput from 'src/components/EmailOrPhoneListInput'
import './MagicSignInPage.css'
import { Dict } from 'src/types'
import { createMagicSignIn } from 'src/api'
import { assertNotNull } from 'src/helpers/util'
import logger from 'src/helpers/logger'
import { paths } from 'src/config/routes'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import './SessionsPage.css'
import greenlightLogo from 'src/assets/images/logos/greenlight-banner-logo.svg'
import Tr, { En, Es, tr } from 'src/components/Tr'

interface State {
  emailOrMobile: string
  rememberMe: boolean
  submitted: boolean
  isSubmitting: boolean
}

export default class MagicSignInPage extends React.Component<Dict<any>, State> {
  emailOrMobileRef = React.createRef<EmailOrPhoneListInput>()

  state: State = {
    emailOrMobile: '',
    rememberMe: false,
    submitted: false,
    isSubmitting: false,
  }

  async submit() {
    if (this.state.isSubmitting) return

    const input = this.emailOrMobileRef?.current

    assertNotNull(input)

    const isValid = input.validate(input.state.value || '')
    if (!isValid) return

    this.setState({ isSubmitting: true })
    try {
      await createMagicSignIn(this.state.emailOrMobile, this.state.rememberMe)
      const alertTitle = tr({ en: 'Magic Sign In Sent', es: 'Inicio de sesión mágico enviado' })
      if (this.state.emailOrMobile.includes('@')) {
        this.$f7.dialog.alert(
          tr({ en: 'You should receive an email shortly with a magic sign in link.', es: 'Debería recibir un correo electrónico en breve con un enlace de inicio de sesión mágico.' }),
          alertTitle,
        )
      } else {
        this.$f7.dialog.alert(
          tr({ en: 'You should receive a text shortly with a magic sign in link.', es: 'You should receive a text shortly with a magic sign in link.' }),
          alertTitle,
        )
      }
    } catch (e) {
      logger.error(e.response)
      this.$f7.dialog.alert(
        tr({ en: "We couldn't set up a magic sign in for that info.", es: 'No pudimos configurar un enlace mágico para esa información.' }),
        tr({ en: 'Magic Sign In Failed', es: 'Error' }),
      )
    } finally {
      this.setState({ isSubmitting: false })
    }
  }

  render() {
    return (
      <Page className="MagicSignInPage" noToolbar noSwipeback loginScreen>
        <Navbar
          title={tr({ en: 'Magic Sign In', es: 'Inciar Sesion Con Magia' })}
        >
          <NavbarHomeLink slot="left" />
        </Navbar>
        <div className="greenlight-logo">
          <img src={greenlightLogo} alt="Greenlight" />
        </div>
        <List form>
          <Block>
            <Tr>
              <En>Enter your email or mobile number, and we'll send you a magic sign in link.</En>
              <Es>Ingrese su correo electrónico o número de teléfono móvil y le enviaremos un enlace mágico para iniciar sesión.</Es>
            </Tr>
          </Block>
          <EmailOrPhoneListInput
            value={this.state.emailOrMobile}
            ref={this.emailOrMobileRef}
            onInput={(e) => {
              this.setState({ emailOrMobile: e.target.value })
            }}
          />
          <ListItem
            checkbox
            title={tr({ es: 'Recuerdame', en: 'Remember Me' })}
            onInput={(e) => {
              this.setState({ rememberMe: e.target.value })
            }}
          />
          <Block>
            <Button outline fill disabled={this.state.isSubmitting} onClick={() => { this.submit() }}>
              {this.state.isSubmitting ? (
                <Tr en="Requesting Magic Link..." es="Enviando..." />
              ) : (
                <Tr en="Request Magic Link" es="Enviar" />
              )}
            </Button>
          </Block>
        </List>
      </Page>
    )
  }
}
