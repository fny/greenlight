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
import { assertNotNull, forceReRender } from 'src/helpers/util'
import { reloadCurrentUser } from 'src/helpers/global'
import logger from 'src/helpers/logger'

import noSymptoms from 'src/assets/images/symptoms/no-symptoms.svg'
import noSymptomsBright from 'src/assets/images/symptoms/no-symptoms-bright.svg'
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
import Tr, { En, Es, tr } from 'src/components/Tr'

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
  noSymptoms,
  noSymptomsBright,
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
    <div className={`SymptomButton ${selected ? 'selected' : ''}`} onClick={onClick}>
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
  noSymptoms: boolean
}

type Symptoms = 'hasFever' | 'hasChills' | 'hasNewCough' | 'hasDifficultyBreathing' | 'hasLossTasteSmell'

export default class SurveyNewPage extends ReactNComponent<SurveyProps, SurveyState> {
  isSequence = false

  isResubmit = false

  currentUser: User

  constructor(props: SurveyProps) {
    super(props)
    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }

    this.currentUser = this.global.currentUser

    const { userId } = this.$f7route.params
    const { resubmit } = this.$f7route.query

    if (!userId) { throw 'userId missing in url' }

    if (userId === 'seq') {
      this.isSequence = true
    } else {
      getUser(userId).then((user) => {
        this.setState({ targetUser: user, isLoaded: true })
      })
    }

    this.isResubmit = resubmit === 'true'

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
      noSymptoms: false,
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

  setContacted(yesNo: boolean): void {
    this.setState({
      showConfirmation: false,
      hadContact: yesNo,
    })
  }

  setDiagnosed(yesNo: boolean): void {
    this.setState({
      showConfirmation: false,
      hadDiagnosis: yesNo,
    })
  }

  setDiagnosisDate(date: Date): void {
    this.setState({
      showConfirmation: false,
      diagnosisDate: DateTime.fromJSDate(date),
    })
  }

  setContactDate(date: Date): void {
    this.setState({
      showConfirmation: false,
      contactDate: DateTime.fromJSDate(date),
    })
  }

  toggleSymptom(symptom: Symptoms): void {
    this.setState({
      ...this.state,
      [symptom]: !this.state[symptom],
      noSymptoms: false,
    })
  }

  noSymptoms(): void {
    this.setState({
      ...this.state,
      noSymptoms: true,
      hasFever: false,
      hasChills: false,
      hasNewCough: false,
      hasDifficultyBreathing: false,
      hasLossTasteSmell: false,
    })
  }

  submit1(): void {
    if (
      !this.state.noSymptoms
      && !this.state.hasFever
      && !this.state.hasChills
      && !this.state.hasNewCough
      && !this.state.hasDifficultyBreathing
      && !this.state.hasLossTasteSmell
    ) {
      this.$f7.dialog.alert(
        tr({
          en: 'Please complete all survey questions. If you do not have symptoms, please click "No Symptoms".',
          es: 'Complete todas las preguntas de la encuesta. Si no tiene síntomas, haga clic en "Sin síntomas".',
        }),
      )
    } else {
      this.setState({
        submitClicked: true,
      })
      if (this.validate()) {
        this.setState({ showConfirmation: true })
      }
    }
  }

  async submit2(): Promise<void> {
    if (!this.validate()) {
      this.setState({ showConfirmation: false })
      return
    }
    const medicalEvents = this.medicalEvents()

    this.$f7.dialog.preloader(tr({ en: 'Submitting...', es: 'Enviando...' }))
    const redirect = this.redirect()
    try {
      // TODO: This should load the data
      const target = this.submittingFor()
      assertNotNull(target)
      const status = await createSymptomSurvey(target, medicalEvents)
      if (!status) {
        throw 'This should never happen, but status was somehow nil.'
      }
      const user = await getUser(target.id) // Reload data
      forceReRender()

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
        tr({
          en: 'Something went wrong. Maybe someone already submitted?',
          es: 'Algo salió mal. ¿Quizás alguien ya envió?',
        }),
        tr({ en: 'Submission Failed', es: 'Error de envío' }),
      )
    }
  }

  validate() {
    const errors = [
      this.state.hadContact === null,
      this.state.hadContact === undefined,
      this.state.hadDiagnosis === null,
      this.state.hadDiagnosis === undefined,
      this.state.hadContact === true && !this.state.contactDate,
      this.state.hadDiagnosis === true && !this.state.diagnosisDate,
      !this.state.noSymptoms
        && !this.state.hasFever
        && !this.state.hasChills
        && !this.state.hasNewCough
        && !this.state.hasDifficultyBreathing
        && !this.state.hasLossTasteSmell,
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
    assertNotNull(submittingFor)

    let pageTitle = tr({
      en: t`Daily Check-ins: ${submittingFor.fullName()}`,
      es: `Encuesta de síntomas: ${submittingFor.fullName()}`,
    })

    if (this.isResubmit) {
      pageTitle = tr({
        en: t`Resubmit Survey: ${submittingFor.fullName()}`,
        es: `Encuesta de síntomas: ${submittingFor.fullName()}`,
      })
    }

    return (
      <Page>
        <Navbar title={pageTitle} />

        {this.state.isLoaded ? (
          <>
            <Block>
              <div className="survey-title">
                {this.isSubmittingForSelf() ? (
                  <Tr en="Do you have any of these symptoms?" es="¿Tienes alguno de estos síntomas?" />
                ) : (
                  <Tr>
                    <En>
                      Does {submittingFor.firstName} have any of these symptoms?
                    </En>
                    <Es>
                      ¿{submittingFor.firstName} tiene alguno de estos síntomas?
                    </Es>
                  </Tr>
                )}
              </div>
            </Block>
            <div className="SymptomButtons">
              <SymptomButton
                title={tr({ en: 'No Symptoms', es: 'Sin síntomas' })}
                image="noSymptoms"
                onClick={() => this.noSymptoms()}
                selected={this.state.noSymptoms}
              />
              <SymptomButton
                title={tr({ en: 'Fever', es: 'Fiebre' })}
                image="fever"
                onClick={() => this.toggleSymptom('hasFever')}
                selected={this.state.hasFever}
              />
              <SymptomButton
                title={tr({ en: 'Chills', es: 'Escalofríos' })}
                image="chills"
                onClick={() => this.toggleSymptom('hasChills')}
                selected={this.state.hasChills}
              />
              <SymptomButton
                title={tr({ en: 'New Cough', es: 'Nueva tos' })}
                image="cough"
                onClick={() => this.toggleSymptom('hasNewCough')}
                selected={this.state.hasNewCough}
              />
              <SymptomButton
                title={tr({ en: 'Difficulty<br />Breathing', es: 'Respiración<br />dificultosa' })}
                image="difficultyBreathing"
                onClick={() => this.toggleSymptom('hasDifficultyBreathing')}
                selected={this.state.hasDifficultyBreathing}
              />
              <SymptomButton
                title={tr({
                  en: 'New Loss of<br />Taste/Smell',
                  es: 'Nueva pérdida de<br/>gusto/olfato',
                })}
                image="tasteSmell"
                onClick={() => this.toggleSymptom('hasLossTasteSmell')}
                selected={this.state.hasLossTasteSmell}
              />
            </div>
            <Block style={{ marginTop: 0 }}>
              <div className="survey-title">
                <Tr en="COVID Contact?" es="Contacto COVID?" />
              </div>
              {this.isSubmittingForSelf() ? (
                <Tr>
                  <En>
                    Have you had close contact—within 6 feet for at least 15 minutes—with someone diagnosed with
                    COVID-19 or someone with symptoms?
                  </En>
                  <Es>
                    ¿Ha tenido contacto cercano, dentro de los 6 pies durante al menos 15 minutos, con alguien
                    diagnosticado con COVID-19 o alguien con síntomas?
                  </Es>
                </Tr>
              ) : (
                <Tr>
                  <En>
                    Has {submittingFor.firstName} had close contact—within 6 feet for at least 15 minutes—with someone
                    diagnosed with COVID-19 or someone with symptoms?
                  </En>
                  <Es>
                    ¿{submittingFor.firstName} ha tenido contacto cercano, dentro de los 6 pies durante al menos 15
                    minutos, con alguien diagnosticado con COVID-19 o alguien con síntomas?
                  </Es>
                </Tr>
              )}
              <br />
              <DatedYesNoButton
                setYesNo={(yesNo: boolean) => this.setContacted(yesNo)}
                setDate={(date: Date) => this.setContactDate(date)}
                showErrors={this.state.submitClicked}
              />
              <div className="survey-title">
                <Trans id="SurveyNewPage.covid_diagnosis_title">COVID Diagnosis?</Trans>
              </div>
              {this.isSubmittingForSelf() ? (
                <Trans id="SurveyNewPage.covid_diagnosis">
                  Have you been diagnosed with or tested positive for COVID-19?
                </Trans>
              ) : (
                <Trans id="SurveyNewPage.covid_diagnosis_child">
                  Has {submittingFor.firstName}
                  been diagnosed with or tested positive for COVID-19?
                </Trans>
              )}
              <DatedYesNoButton
                setYesNo={(yesNo: boolean) => this.setDiagnosed(yesNo)}
                setDate={(date: Date) => this.setDiagnosisDate(date)}
                showErrors={this.state.submitClicked}
              />

              <br />
              {!this.state.showConfirmation && (
                <Case test={this.hasNextUser()}>
                  <When value>
                    <Button fill onClick={() => this.submit1()}>
                      <Trans id="SurveyNewPage.continue">Continue to {this.nextUser()?.firstName}</Trans>
                    </Button>
                  </When>
                  <When value={false}>
                    <Button fill onClick={() => this.submit1()}>
                      <Trans id="SurveyNewPage.finish">Finish</Trans>
                    </Button>
                  </When>
                </Case>
              )}
              {this.state.showConfirmation && (
                <Button fill onClick={() => this.submit2()}>
                  <Trans id="SurveyNewPage.confirmation">Are you sure?</Trans>
                </Button>
              )}
            </Block>
          </>
        ) : (
          <Preloader />
        )}
      </Page>
    )
  }
}
