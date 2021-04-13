import React from 'reactn'

import {
  Page, Navbar, Block, Button, List, ListInput,
} from 'framework7-react'

import { formatPhone, haveEqualAttrs, deleteBlanks } from 'src/helpers/util'
import { updateCurrentUser } from 'src/api'
import { paths } from 'src/config/routes'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/helpers/errors'

import logger from 'src/helpers/logger'
import { toggleLocale } from 'src/helpers/global'
import { User } from 'src/models/User'
import Tr, { En, Es, tr } from 'src/components/Tr'

interface State {
  originalEmail: string | null
  originalPhone: string
  updatedUser: Partial<User>
  // textOrEmailAlerts: 'text' | 'email'
  showMobileNumberError: boolean
  currentUser: User
}

export default class WelcomeReviewUserPage extends ReactNComponent<any, State> {
  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }

    this.state = {
      originalEmail: this.global.currentUser.email,
      originalPhone: formatPhone(this.global.currentUser.mobileNumber),
      updatedUser: (() => {
        const user = { ...this.global.currentUser }
        user.mobileNumber = formatPhone(user.mobileNumber)
        return user
      })(),
      showMobileNumberError: false,
      currentUser: this.global.currentUser,
    }
  }

  validate() {
    return this.$f7.input.validateInputs('#WelcomeReviewPage-form')
  }

  extractUpdateAttrs(user: Partial<User>): Partial<User> {
    return deleteBlanks({
      firstName: user.firstName,
      lastName: user.lastName,
      locale: user.locale,
      // dailyReminderType: user.dailyReminderType,
    })
  }

  async submit() {
    if (!this.validate()) {
      return
    }
    const userAttrs = this.extractUpdateAttrs(this.state.currentUser)
    const updatedUserAttrs = this.extractUpdateAttrs(this.state.updatedUser)

    if (haveEqualAttrs(userAttrs, updatedUserAttrs)) {
      this.$f7router.navigate(paths.welcomePasswordPath)
      return
    }

    this.$f7.dialog.preloader(tr({ en: 'Submitting changes...', es: 'Enviando cambios...' }))
    try {
      const user = await updateCurrentUser(updatedUserAttrs)
      this.setGlobal({ currentUser: user })
      this.$f7.dialog.close()
      this.$f7router.navigate(paths.welcomePasswordPath)
    } catch (error) {
      this.$f7.dialog.close()
      logger.error(error)
      // TODO: make errors smarter
      this.$f7.dialog.alert(
        tr({ en: 'Something went wrong', es: 'Algo salio mal' }),
        tr({ en: 'Update Failed', es: 'Error al actualizar' }),
      )
    }
  }

  render() {
    const { updatedUser } = this.state
    updatedUser.locale = this.global.locale
    // const isDifferentEmail = updatedUser.email !== this.state.originalEmail
    // const isDifferentMobileNumber =
    //   updatedUser.mobileNumber !== this.state.originalEmail
    return (
      <Page>
        <Navbar
          title={tr({ en: 'Review Your Info', es: 'Revisa su información' })}
        />
        <Block>
          <p>
            <Tr>
              <En>
                Here is the information we have on file for you. Feel free to make
                any changes.
              </En>
              <Es>
                Aquí está la información que tenemos archivada para usted. No dude en hacer cualquier cambio.
              </Es>
            </Tr>
          </p>
        </Block>

        <List noHairlinesMd form id="WelcomeReviewPage-form">
          <ListInput
            label={tr({ en: 'First Name', es: 'Nombre' })}
            type="text"
            placeholder={tr({ en: 'Your first name', es: 'Su nombre' })}
            value={updatedUser.firstName}
            onChange={(e) => {
              updatedUser.firstName = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            validateOnBlur
            required
          />
          <ListInput
            label={tr({ en: 'Last Name', es: 'Apellido' })}
            type="text"
            placeholder={tr({ en: 'Your last name', es: 'Su apellido' })}
            value={updatedUser.lastName}
            onChange={(e) => {
              updatedUser.lastName = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            validateOnBlur
            required
          />
          <ListInput
            label={tr({ en: 'Language', es: 'Idioma' })}
            type="select"
            defaultValue={this.global.locale}
            placeholder={tr({ en: 'Please choose...', es: 'Escoger...' })}
            onChange={(e) => {
              toggleLocale()
              updatedUser.locale = e.target.value
              this.setState({ updatedUser })
            }}
          >
            <option value="en">
              {tr({ en: 'English', es: 'English' })}
            </option>
            <option value="es">
              {tr({ en: 'Español', es: 'Español' })}
            </option>
          </ListInput>
          <ListInput
            disabled
            label={tr({ en: 'Email', es: 'Correo electrónico' })}
            type="email"
            placeholder={tr({ en: 'Your email', es: 'Su correo electrónico' })}
            value={updatedUser.email || ''}
            // info={
            //   isDifferentEmail
            //     ? "We'll need to verify this new email later."
            //     : undefined
            // }
            info={
              tr({ en: "Can't be changed at this time.", es: 'No se puede cambiar en este momento' })
            }
            onChange={(e) => {
              updatedUser.email = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            required
            validate
          />
          <ListInput
            disabled
            label={tr({ en: 'Mobile Number', es: '' })}
            type="tel"
            placeholder={tr({ en: 'Your mobile number', es: '' })}
            value={updatedUser.mobileNumber || ''}
            info={
              tr({ en: "Can't be changed at this time.", es: '' })
            }
            errorMessageForce={this.state.showMobileNumberError}

            // info={
            //   isDifferentMobileNumber
            //     ? "We'll need to verify this new phone number later."
            //     : undefined
            // }
            onInput={(e) => {
              updatedUser.mobileNumber = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            required
            validate
          />

          <Block>
            <p><Tr en="Next you'll set your password." es="A continuación, establecerá su contraseña" /></p>
            <Button onClick={() => this.submit()} fill>
              <Tr en="Continue" es="Seguir" />
            </Button>
            {/* TOOD: HACK: Preload password image. */}
            <img
              alt={tr({ en: 'Greenlight gives security the highest importance.', es: '' })}
              src="/images/welcome-secure.svg"
              style={{ display: 'none' }}
            />
          </Block>
        </List>
      </Page>
    )
  }
}
