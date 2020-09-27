import React, { useDebugValue } from 'reactn'

import { clone } from 'lodash'
import { Page, Navbar, Block, Button, List, ListInput } from 'framework7-react'

import { User } from '../../common/models/User'
import { formatPhone, haveEqualAttrs, deleteBlanks } from 'src/common/util'
import { updateUser } from 'src/common/api'
import logger from 'src/common/logger'
import { languageData } from 'src/locales/es/messages'
import { paths } from 'src/routes'

import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'

interface State {
  originalEmail: string | null
  originalPhone: string
  updatedUser: User
  // textOrEmailAlerts: 'text' | 'email'
  showMobileNumberError: boolean
}

export default class ReviewUserPage extends React.Component<any, State> {
  state: State = {
    originalEmail: this.global.currentUser.email,
    originalPhone: formatPhone(this.global.currentUser.phone),
    updatedUser: (() => {
      const user = clone(this.global.currentUser)
      user.mobileNumber = formatPhone(user.mobileNumber)
      return user
    })(),
    showMobileNumberError: false
  }

  validate() {
    return this.$f7.input.validateInputs('#WelcomeReviewPage-form')
  }
  extractUpdateAttrs(user: User): Partial<User> {
    return deleteBlanks({
      firstName: user.firstName,
      lastName: user.lastName,
      language: user.language,
      dailyReminderType: user.dailyReminderType
    })
  }
  // TODO: Reactor: Extract this pattern
  async submit() {
    if (!this.validate()) { 
      return
    }
    const userAttrs = this.extractUpdateAttrs(this.global.currentUser)
    const updatedUserAttrs = this.extractUpdateAttrs(this.state.updatedUser)
    
    if (haveEqualAttrs(userAttrs, updatedUserAttrs)) {
      this.$f7router.navigate(paths.welcomePasswordPath)
      return
    }

    this.$f7.dialog.preloader(i18n._(t('WelcomeReviewPage.submitting_changes')`Submitting changes...`))
    try {
      const user = await updateUser(this.global.currentUser, updatedUserAttrs)
      this.setGlobal({ currentUser: user })
      this.$f7.dialog.close()
      this.$f7router.navigate(paths.welcomePasswordPath)
    } catch (error) {
      this.$f7.dialog.close()
      console.error(error)
      // TODO: i18n
      this.$f7.dialog.alert(
        i18n._(t('WelcomeReviewPage.somethings_wrong')`Something went wrong`),
        i18n._(t('WelcomeReviewPage.update_failed')`Update Failed`))
    }
  }

  render() {
    const updatedUser = this.state.updatedUser
    updatedUser.language = this.global.language
    // const isDifferentEmail = updatedUser.email !== this.state.originalEmail
    // const isDifferentMobileNumber =
    //   updatedUser.mobileNumber !== this.state.originalEmail
    return (
      <Page>
        <Navbar 
          title={i18n._(t('WelcomeReviewPage.review_info')`Review Your Info`)} 
          backLink={true} 
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
            label={i18n._(t('WelcomeReviewPage.first_name_label')`First Name`)}
            type="text"
            placeholder={i18n._(t('WelcomeReviewPage.first_name_placeholder')`Your first name`)}
            value={updatedUser.firstName}
            onChange={(e) => {
              updatedUser.firstName = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            validateOnBlur
            required
          />
          <ListInput
            label={i18n._(t('WelcomeReviewPage.last_name_label')`Last Name`)}
            type="text"
            placeholder={i18n._(t('WelcomeReviewPage.last_name_placeholder')`Your last name`)}
            value={updatedUser.lastName}
            onChange={(e) => {
              updatedUser.lastName = (e.target.value as string) || ''
              this.setState({ updatedUser })
            }}
            validateOnBlur
            required
          />
          <ListInput
            label={i18n._(t('WelcomeReviewPage.reminders_label')`Recieve Reminders By`)}
            type="select"
            defaultValue="text"
            placeholder={i18n._(t('WelcomeReviewPage.reminders_placeholder')`Please choose...`)}
            onChange={e => {
              updatedUser.dailyReminderType = e.target.value
              this.setState({ updatedUser })
            }}
          >
            <option value="text">Text Message</option>
            <option value="email">Email</option>
          </ListInput>
          <ListInput
            label={i18n._(t('WelcomeReviewPage.language_label')`Language`)}
            type="select"
            defaultValue={this.global.language}
            placeholder={i18n._(t('WelcomeReviewPage.language_placeholder')`Please choose...`)}
            onChange={e => {
              updatedUser.language = e.target.value
              this.setState({ updatedUser })
            }}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </ListInput>
          <ListInput
            disabled
            label={i18n._(t('WelcomeReviewPage.email_label')`Email`)}
            type="email"
            placeholder={i18n._(t('WelcomeReviewPage.email_placeholder')`Your email`)}
            value={updatedUser.email || ''}
            // info={
            //   isDifferentEmail
            //     ? "We'll need to verify this new email later."
            //     : undefined
            // }
            info={
              i18n._(
                t('WelcomeReviewPage.email_failed_to_change')
                `Can't be changed at this time.`)
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
            label={i18n._(t('WelcomeReviewPage.phone_label')`Mobile Number`)}
            type="tel"
            placeholder={i18n._(t('WelcomeReviewPage.phone_placeholder')`Your mobile number`)}
            value={updatedUser.mobileNumber || ''}
            info={
              i18n._(
                t('WelcomeReviewPage.phone_failed_to_change')
                `Can't be changed at this time.`)
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
              Continue
            </Button>
            {/* TOOD: HACK: Preload password image. */}
            <img 
              alt={i18n._(
                t('WelcomeReviewPage.security_alt_text')
                `Greenlight gives security the highest importance.`)}
              src="/images/welcome-secure.svg" style={{display: 'none'}}></img>
          </Block>
        </List>
      </Page>
    )
  }
}
