import React from 'reactn'
import {
  Page, Navbar, Block, List, ListInput, Button, Toggle, ListItem,
} from 'framework7-react'
import { SyntheticEvent } from 'react'
import { updateCurrentUser } from 'src/api'
import { dynamicPaths } from 'src/config/routes'
import { User } from 'src/models'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/helpers/errors'

import logger from 'src/helpers/logger'
import passwordImage from 'src/assets/images/illustrations/password.png'
import { When, Case } from 'src/components/Case'
import Tr, { En, Es, tr } from 'src/components/Tr'

interface State {
  password: string
  errorMessage: string | null
  showErrorMessage: boolean
  isPasswordHidden: boolean
  currentUser: User
}

export default class extends ReactNComponent<any, State> {
  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }

    this.state = {
      password: '',
      errorMessage: null,
      showErrorMessage: false,
      isPasswordHidden: true,
      currentUser: this.global.currentUser,
    }
  }

  toggleReveal(e: SyntheticEvent) {
    this.setState({ isPasswordHidden: !(e.target as any).checked })
    // this.$f7.input.validateInputs('#WelcomePasswordPage-form')
  }

  async submit() {
    if (this.state.password.length < 8) {
      this.setState({
        errorMessage: tr({ es: 'Contraseña es demasiado corta', en: 'Password is too short.' }),
        showErrorMessage: true,
      })
      return
    }
    this.setState({ errorMessage: '', showErrorMessage: false })
    this.$f7.input.validateInputs('#WelcomePasswordPage-form')

    this.$f7.dialog.preloader(tr({ es: 'Enviando...', en: 'Submitting changes...' }))
    try {
      const user = await updateCurrentUser({ password: this.state.password })
      this.setGlobal({ currentUser: user })
      this.$f7.dialog.close()
      this.$f7router.navigate(dynamicPaths.afterWelcomePasswordPath())
    } catch (error) {
      this.$f7.dialog.close()
      logger.error(error)
      this.$f7.dialog.alert(
        tr({ es: 'Algo salio mal', en: 'Something went wrong' }),
        tr({ es: 'Cambio fallido', en: 'Update Failed' }),
      )
    }
  }

  render() {
    return (
      <Page>
        <Navbar title={tr({ es: 'Su Contraseña', en: 'Set Your Password' })} />
        <Block>
          <p>
            <Tr>
              <En>
                You can sign in with your email address or mobile number and this
                password. It must be at least 8 characters long.
              </En>
              <Es>
                Puedes iniciar sesión con tu correo electrónico o número de teléfono móvil y esta contraseña. Debe tener al menos 8 caracteres.
              </Es>
            </Tr>
          </p>
        </Block>
        <Block>
          <List noHairlines form id="WelcomePasswordPage-form">
            <ListInput
              label={tr({ es: 'Contraseña', en: 'Password' })}
              type={this.state.isPasswordHidden ? 'password' : 'text'}
              placeholder={tr({ es: 'Contraseña', en: 'Password' })}
              value={this.state.password}
              errorMessage={this.state.errorMessage || ''}
              errorMessageForce={this.state.showErrorMessage}
              onChange={(e) => {
                this.setState({ password: e.target.value })
              }}
              required
              validate
            />

            <ListItem>
              <span><Tr en="Reveal Password" es="Revelar contraseña" /></span>
              <Toggle color="green" onChange={(e) => this.toggleReveal(e)} />
            </ListItem>
          </List>
          <img
            alt={
              tr({ es: 'Greenlight otorga la máxima importancia a la seguridad', en: 'Greenlight gives security the highest importance.' })
            }
            src={passwordImage}
            width="100%"
          />

          <Case test={this.state.currentUser.children.length > 0}>
            <When value>
              <p>
                <Tr en="Next you'll review your children." es="A continuación, revisarás a sus hijos" />
              </p>
            </When>
            <When value={false}>
              <p>
                <Tr en="Next you'll fill out your first survey!" es="¡A continuación, completarás tu primera encuesta!" />
              </p>
            </When>
          </Case>

          <Button large fill onClick={() => this.submit()}>
            <Tr en="Continue" es="Continuar" />
          </Button>
        </Block>
      </Page>
    )
  }
}
