import React from 'reactn'

import {
  Page, Navbar, Block, Button, List, ListInput,
} from 'framework7-react'

import { formatPhone, haveEqualAttrs, deleteBlanks } from 'src/helpers/util'
import { updateCurrentUser } from 'src/api'
import { paths } from 'src/config/routes'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/helpers/errors'

import { t, Trans } from '@lingui/macro'
import logger from 'src/helpers/logger'
import { toggleLocale } from 'src/helpers/global'
import { User } from 'src/models/User'

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

    this.$f7.dialog.preloader(t({ id: 'WelcomeReviewPage.submitting_changes', message: 'Submitting changes...' }))
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
        t({ id: 'WelcomeReviewPage.somethings_wrong', message: 'Something went wrong' }),
        t({ id: 'WelcomeReviewPage.update_failed', message: 'Update Failed' }),
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
          title={t({ id: 'WelcomeReviewPage.review_info', message: 'Review Your Info' })}
        />
        <Block>
          <p>
            <Trans id="WelcomeReviewPage.info_on_file">
              Here is the information we have on file for you. Feel free to make
              any changes.
            </Trans>
          </p>
        </Block>

        <List noHairlinesMd form id="WelcomeReviewPage-form">
          <ListInput
            label={t({ id: 'WelcomeReviewPage.first_name_label', message: 'First Name' })}
            type="text"
            placeholder={t({ id: 'WelcomeReviewPage.first_name_placeholder', message: 'Your first name' })}
            value={updatedUser.firstName}
            onChange={(e) => {
              updatedUser.firstName = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            validateOnBlur
            required
          />
          <ListInput
            label={t({ id: 'WelcomeReviewPage.last_name_label', message: 'Last Name' })}
            type="text"
            placeholder={t({ id: 'WelcomeReviewPage.last_name_placeholder', message: 'Your last name' })}
            value={updatedUser.lastName}
            onChange={(e) => {
              updatedUser.lastName = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            validateOnBlur
            required
          />
          {/* <ListInput
            label={t({ id: 'WelcomeReviewPage.reminders_label', message: 'Receive Reminders By' })}
            type="select"
            defaultValue="text"
            placeholder={t({ id: 'WelcomeReviewPage.reminders_placeholder', message: 'Please choose...' })}
            onChange={(e) => {
              updatedUser.dailyReminderType = e.target.value
              this.setState({ updatedUser })
            }}
          >
            <option value="text">
              {t({ id: 'WelcomeReviewPage.text_message', message: 'Text Message' })}
            </option>
            <option value="email">
              {t({ id: 'WelcomeReviewPage.email', message: 'Email' })}
            </option>
          </ListInput> */}
          <ListInput
            label={t({ id: 'WelcomeReviewPage.language_label', message: 'Language' })}
            type="select"
            defaultValue={this.global.locale}
            placeholder={t({ id: 'WelcomeReviewPage.language_placeholder', message: 'Please choose...' })}
            onChange={(e) => {
              toggleLocale()
              updatedUser.locale = e.target.value
              this.setState({ updatedUser })
            }}
          >
            <option value="en">
              {t({ id: 'WelcomeReviewPage.english', message: 'English' })}
            </option>
            <option value="es">
              {t({ id: 'WelcomeReviewPage.spanish', message: 'Español' })}
            </option>
          </ListInput>
          <ListInput
            disabled
            label={t({ id: 'WelcomeReviewPage.email_label', message: 'Email' })}
            type="email"
            placeholder={t({ id: 'WelcomeReviewPage.email_placeholder', message: 'Your email' })}
            value={updatedUser.email || ''}
            // info={
            //   isDifferentEmail
            //     ? "We'll need to verify this new email later."
            //     : undefined
            // }
            info={
              t({ id: 'WelcomeReviewPage.email_failed_to_change', message: "Can't be changed at this time." })
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
            label={t({ id: 'WelcomeReviewPage.phone_label', message: 'Mobile Number' })}
            type="tel"
            placeholder={t({ id: 'WelcomeReviewPage.phone_placeholder', message: 'Your mobile number' })}
            value={updatedUser.mobileNumber || ''}
            info={
              t({ id: 'WelcomeReviewPage.phone_failed_to_change', message: "Can't be changed at this time." })
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
            <p><Trans id="WelcomeReviewPage.next_password">Next you'll set your password.</Trans></p>
            <Button onClick={() => this.submit()} fill>
              <Trans id="Common.continue">Continue</Trans>
            </Button>
            {/* TOOD: HACK: Preload password image. */}
            <img
              alt={t({ id: 'WelcomeReviewPage.security_alt_text', message: 'Greenlight gives security the highest importance.' })}
              src="/images/welcome-secure.svg"
              style={{ display: 'none' }}
            />
          </Block>
        </List>
      </Page>
    )
  }
}
