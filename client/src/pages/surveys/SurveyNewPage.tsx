import React from 'reactn'
import {
  Page, Navbar, Block, Button, Preloader,
} from 'framework7-react'
import './SurveyNewPage.css'
import { paths } from 'src/config/routes'
import { MedicalEventTypes } from 'src/models/MedicalEvent'
import { CUTOFF_TIME } from 'src/models/GreenlightStatus'
import { createSymptomSurvey, getUser } from 'src/api'
import { User } from 'src/models'
import { NoCurrentUserError } from 'src/helpers/errors'
import { ReactNComponent } from 'reactn/build/components'
import { DateTime } from 'luxon'
import { t, Trans } from '@lingui/macro'
import { assertNotNull } from 'src/helpers/util'
import { reloadCurrentUser } from 'src/helpers/global'
import logger from 'src/helpers/logger'

import fever from 'src/assets/images/symptoms/fever.svg'
import feverBright from 'src/assets/images/symptoms/fever-bright.svg'
import cough from 'src/assets/images/symptoms/cough.svg'
import coughBright from 'src/assets/images/symptoms/cough-bright.svg'
import chills from 'src/assets/images/symptoms/chills.svg'
import chillsBright from 'src/assets/images/symptoms/chills-bright.svg'
import difficultyBreathing from 'src/assets/images/symptoms/difficulty-breathing.svg'
import difficultyBreathingBright from 'src/assets/images/symptoms/difficulty-breathing-bright.svg'
import tasteSmell from 'src/assets/images/symptoms/taste-smell.svg'
import tasteSmellBright from 'src/assets/images/symptoms/taste-smell-bright.svg'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import { Case, When } from 'src/components/Case'
import DatedYesNoButton from 'src/components/DatedYesNoButton'

const buttonImages = {
  cough,
  coughBright,
  fever,
  feverBright,
  chills,
  chillsBright,
  difficultyBreathing,
  difficultyBreathingBright,
  tasteSmell,
  tasteSmellBright,
}

interface SymptomButtonProps {
  title: string
  image: keyof typeof buttonImages
  selected?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function SymptomButton({
  title, image, selected, onClick,
}: SymptomButtonProps) {
  return (
    <div
      className={`SymptomButton ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <img alt={title} src={buttonImages[image]} />
      <img alt={title} src={(buttonImages as any)[`${image}Bright`]} />
      <br />
      <span dangerouslySetInnerHTML={{ __html: title }} />
    </div>
  )
}

interface SurveyProps {
  currentUser: User
  userId: string
}

interface SurveyState {
  isLoaded: boolean
  hasFever: boolean
  hasChills: boolean
  hasNewCough: boolean
  hasDifficultyBreathing: boolean
  hasLossTasteSmell: boolean
  hadDiagnosis: boolean | null
  diagnosisDate: DateTime | null
  hadContact: boolean | null
  contactDate: DateTime | null
  diagnosisError?: string | null
  submitClicked?: boolean
  showConfirmation: boolean
  targetUser: User | null
}

type Symptoms =
  | 'hasFever'
  | 'hasChills'
  | 'hasNewCough'
  | 'hasDifficultyBreathing'
  | 'hasLossTasteSmell'

export default class SurveyNewPage extends ReactNComponent<SurveyProps, SurveyState> {
  isSequence = false

  currentUser: User

  constructor(props: SurveyProps) {
    super(props)
    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }

    this.currentUser = this.global.currentUser

    const { userId } = this.$f7route.params
    if (!userId) { throw 'userId missing in url' }

    if (userId === 'seq') {
      this.isSequence = true
    } else {
      getUser(userId).then((user) => {
        this.setState({ targetUser: user, isLoaded: true })
      })
    }

    this.state = {
      isLoaded: this.isSequence,
      hasFever: false,
      hasChills: false,
      hasNewCough: false,
      hasDifficultyBreathing: false,
      hasLossTasteSmell: false,
      diagnosisDate: null,
      hadDiagnosis: null,
      contactDate: null,
      hadContact: null,
      showConfirmation: false,
      targetUser: null,
    }
  }

  redirect() {
    return this.$f7route.query.redirect || null
  }

  medicalEvents() {
    const events = []
    if (this.state.hasFever) {
      events.push({
        eventType: MedicalEventTypes.FEVER,
        occurredAt: DateTime.local(),
      })
    }
    if (this.state.hasChills) {
      events.push({
        eventType: MedicalEventTypes.CHILLS,
        occurredAt: DateTime.local(),
      })
    }
    if (this.state.hasNewCough) {
      events.push({
        eventType: MedicalEventTypes.NEW_COUGH,
        occurredAt: DateTime.local(),
      })
    }
    if (this.state.hasDifficultyBreathing) {
      events.push({
        eventType: MedicalEventTypes.DIFFICULTY_BREATHING,
        occurredAt: DateTime.local(),
      })
    }
    if (this.state.hasLossTasteSmell) {
      events.push({
        eventType: MedicalEventTypes.LOST_TASTE_SMELL,
        occurredAt: DateTime.local(),
      })
    }
    if (this.state.hadDiagnosis && this.state.diagnosisDate) {
      events.push({
        eventType: MedicalEventTypes.COVID_DIAGNOSIS,
        occurredAt: this.state.diagnosisDate,
      })
    }
    if (this.state.hadContact && this.state.contactDate) {
      events.push({
        eventType: MedicalEventTypes.COVID_EXPOSURE,
        occurredAt: this.state.contactDate,
      })
    }
    return events
  }

  submittingFor(): User | null {
    if (this.isSequence) {
      if (CUTOFF_TIME.isAfter(DateTime.local())) {
        return this.currentUser.usersNotSubmitted()[0] || null
      }
      return this.currentUser.usersNotSubmittedForTomorrow()[0] || null
    }
    return this.state.targetUser
  }

  isSubmittingForSelf(): boolean {
    return this.submittingFor() === this.currentUser
  }

  hasNextUser(): boolean {
    if (!this.isSequence) return false
    return this.currentUser.usersNotSubmitted().length > 1
  }

  nextUser(): User | null {
    if (!this.isSequence) return null
    return this.currentUser.usersNotSubmitted()[1] || null
  }

  setContacted(yesNo: boolean) {
    this.setState({
      showConfirmation: false,
      hadContact: yesNo,
    })
  }

  setDiagnosed(yesNo: boolean) {
    this.setState({
      showConfirmation: false,
      hadDiagnosis: yesNo,
    })
  }

  setDiagnosisDate(date: Date) {
    this.setState({
      showConfirmation: false,
      diagnosisDate: DateTime.fromJSDate(date),
    })
  }

  setContactDate(date: Date) {
    this.setState({
      showConfirmation: false,
      contactDate: DateTime.fromJSDate(date),
    })
  }

  toggleSymptom(symptom: Symptoms) {
    this.setState({
      ...this.state,
      [symptom]: !this.state[symptom],
    })
  }

  submit1() {
    this.setState({
      submitClicked: true,
    })
    if (this.validate()) {
      this.setState({ showConfirmation: true })
    }
  }

  async submit2() {
    if (!this.validate()) {
      this.setState({ showConfirmation: false })
      return
    }
    const medicalEvents = this.medicalEvents()

    this.$f7.dialog.preloader(
      t({ id: 'SurveyNewPage.submitting', message: 'Submitting...' }),
    )
    const redirect = this.redirect()
    try {
      // TODO: This should load the data
      const target = this.submittingFor()
      assertNotNull(target)
      const status = await createSymptomSurvey(target, medicalEvents)
      if (!status) {
        throw 'This should never happen, but status was somehow nil.'
      }
      const user = await reloadCurrentUser() // Reload data
      this.$f7.dialog.close()

      if (redirect) {
        this.$f7router.navigate(redirect, { reloadCurrent: true, ignoreCache: true })
      } else if (this.isSequence && user.usersNotSubmitted().length > 0) {
        this.$f7router.refreshPage()
      } else {
        this.$f7router.navigate(paths.surveysThankYouPath)
      }
    } catch (error) {
      if (!error.response) {
        throw error
      }

      if (error.response.status === 422) {
        if (redirect) {
          this.$f7router.navigate(redirect, { reloadCurrent: true, ignoreCache: true })
        } else {
          this.$f7router.navigate(paths.dashboardPath)
        }
      }

      this.$f7.dialog.close()
      logger.error(error)
      // TODO: Make errors smarter
      this.$f7.dialog.alert(
        t({ id: 'SurveyNewPage.submission_failed_message', message: 'Something went wrong. Maybe someone already submitted?' }),
        t({ id: 'SurveyNewPage.submission_failed_title', message: 'Submission Failed' }),
      )
    }
  }

  validate() {
    const errors = [
      this.state.hadContact === null,
      this.state.hadContact === undefined,
      this.state.hadDiagnosis === null,
      this.state.hadDiagnosis === undefined,
      this.state.hadContact === true
      && !this.state.contactDate,
      this.state.hadDiagnosis === true
      && !this.state.diagnosisDate,
    ]
    return !errors.includes(true)
  }

  render() {
    const user = this.currentUser
    if (!user) {
      // TODO: Flash message
      this.$f7router.navigate('/')
      return <></>
    }
    const submittingFor = this.submittingFor()

    if (submittingFor === null) {
      return (
        <Page>
          <Navbar title={t({ id: 'SurveyNewPage.already_submitted_title', message: 'Already Submitted' })}>
            <NavbarHomeLink slot="left" />
          </Navbar>
          <Block>
            <Trans id="SurveyNewPage.already_submitted_message">
              All surveys have already been submitted for today. Please check back later!
            </Trans>
          </Block>
        </Page>
      )
    }

    return (
      <Page>
        <Navbar
          title={t({ id: 'SurveyNewPage.title', message: t`Daily Check-ins: ${submittingFor.fullName()}` })}
        />

        {
          this.state.isLoaded
            ? (
              <>
                <Block>
                  <div className="survey-title">
                    {
                      this.isSubmittingForSelf()
                        ? (
                          <Trans id="SurveyNewPage.any_symptoms">
                            Do you have any of these symptoms?
                          </Trans>
                        )
                        : (
                          <Trans id="SurveyNewPage.any_symptoms_child">
                            Does
                            {submittingFor?.firstName}
                            have any of these symptoms?
                          </Trans>
                        )
                    }
                  </div>
                </Block>
                <div className="SymptomButtons">
                  <SymptomButton
                    title={t({ id: 'SurveyNewPage.fever', message: 'Fever' })}
                    image="fever"
                    onClick={() => this.toggleSymptom('hasFever')}
                    selected={this.state.hasFever}
                  />
                  <SymptomButton
                    title={t({ id: 'SurveyNewPage.chills', message: 'Chills' })}
                    image="chills"
                    onClick={() => this.toggleSymptom('hasChills')}
                    selected={this.state.hasChills}
                  />
                  <SymptomButton
                    title={t({ id: 'SurveyNewPage.new_cough', message: 'New Cough' })}
                    image="cough"
                    onClick={() => this.toggleSymptom('hasNewCough')}
                    selected={this.state.hasNewCough}
                  />
                  <SymptomButton
                    title={t({ id: 'SurveyNewPage.difficulty_breathing', message: 'Difficulty<br />Breathing' })}
                    image="difficultyBreathing"
                    onClick={() => this.toggleSymptom('hasDifficultyBreathing')}
                    selected={this.state.hasDifficultyBreathing}
                  />
                  <SymptomButton
                    title={t({ id: 'SurveyNewPage.loss_of_smell', message: 'Loss of<br />Taste/Smell' })}
                    image="tasteSmell"
                    onClick={() => this.toggleSymptom('hasLossTasteSmell')}
                    selected={this.state.hasLossTasteSmell}
                  />
                </div>
                <Block style={{ marginTop: 0 }}>
                  <div className="survey-title">
                    <Trans id="SurveyNewPage.covid_contact_title">COVID Contact?</Trans>
                  </div>
                  {
              this.isSubmittingForSelf()
                ? (
                  <Trans id="SurveyNewPage.covid_contact">
                    Have you had close contact—within 6 feet for at least 15
                    minutes—with someone diagnosed with COVID-19?
                  </Trans>
                )
                : (
                  <Trans id="SurveyNewPage.covid_contact_child">
                    Has {submittingFor?.firstName}
                    had close contact—within 6 feet for at least 15
                    minutes—with someone diagnosed with COVID-19?
                  </Trans>
                )
            }
                  <br />
                  <DatedYesNoButton
                    setYesNo={(yesNo: boolean) => this.setContacted(yesNo)}
                    setDate={(date: Date) => this.setContactDate(date)}
                    showErrors={this.state.submitClicked}
                  />
                  <div className="survey-title">
                    <Trans id="SurveyNewPage.covid_diagnosis_title">COVID Diagnosis?</Trans>
                  </div>
                  {
              this.isSubmittingForSelf()
                ? (
                  <Trans id="SurveyNewPage.covid_diagnosis">
                    Have you been diagnosed with or tested positive for COVID-19?
                  </Trans>
                )
                : (
                  <Trans id="SurveyNewPage.covid_diagnosis_child">
                    Has {submittingFor?.firstName}
                    been diagnosed with or tested positive for
                    COVID-19?
                  </Trans>
                )
            }
                  <DatedYesNoButton
                    setYesNo={(yesNo: boolean) => this.setDiagnosed(yesNo)}
                    setDate={(date: Date) => this.setDiagnosisDate(date)}
                    showErrors={this.state.submitClicked}
                  />

                  <br />
                  {!this.state.showConfirmation
          && (
          <Case test={this.hasNextUser()}>
            <When value>
              <Button
                fill
                onClick={
                  () => this.submit1()
                }
              >
                <Trans id="SurveyNewPage.continue">
                  Continue to {this.nextUser()?.firstName}
                </Trans>
              </Button>
            </When>
            <When value={false}>
              <Button
                fill
                onClick={
                () => this.submit1()
              }
              >
                <Trans id="SurveyNewPage.finish">Finish</Trans>
              </Button>
            </When>
          </Case>
          )}
                  {this.state.showConfirmation
            && (
            <Button
              fill
              onClick={
              () => this.submit2()
            }
            >
              <Trans id="SurveyNewPage.confirmation">Are you sure?</Trans>
            </Button>
            )}
                </Block>
              </>
            )
            : <Preloader />
        }
      </Page>

    )
  }
}
