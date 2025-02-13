import React from 'reactn'

import {
  Page, Navbar, Block, Button, Preloader, ListInput, List,
} from 'framework7-react'
import './SurveyNewPage.css'
import { paths } from 'src/config/routes'
import { MedicalEvent, MedicalEventTypes } from 'src/models/MedicalEvent'
import { CUTOFF_TIME } from 'src/models/GreenlightStatus'
import { createGuestSymptomSurvey, createSymptomSurvey, getUser } from 'src/api'
import { User } from 'src/models'
import { NoCurrentUserError } from 'src/helpers/errors'
import { ReactNComponent } from 'reactn/build/components'
import { DateTime } from 'luxon'
import { assertNotNull } from 'src/helpers/util'
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
import diarhea from 'src/assets/images/symptoms/diarhea.svg'
import diarheaBright from 'src/assets/images/symptoms/diarhea-bright.svg'
import headache from 'src/assets/images/symptoms/headache.svg'
import headacheBright from 'src/assets/images/symptoms/headache-bright.svg'
import soreThroat from 'src/assets/images/symptoms/sore-throat.svg'
import soreThroatBright from 'src/assets/images/symptoms/sore-throat-bright.svg'

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
  diarhea,
  diarheaBright,
  soreThroat,
  soreThroatBright,
  headache,
  headacheBright,
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
  hasHeadache: boolean
  hasDiarhea: boolean
  hasSoreThroat: boolean
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

type Symptoms = 'hasFever' | 'hasChills' | 'hasNewCough' | 'hasDifficultyBreathing' | 'hasLossTasteSmell' | 'hasHeadache' | 'hasDiarhea' | 'hasSoreThroat'

export default class SurveyNewPage extends ReactNComponent<SurveyProps, SurveyState> {
  isSequence = false

  isGuest = false

  guestName = ''

  isResubmit = false

  currentUser: User

  constructor(props: SurveyProps) {
    super(props)
    const { userId } = this.$f7route.params
    const { guestName } = this.$f7route.query
    this.guestName = guestName || ''

    if (!this.global.currentUser && userId !== 'guest') {
      throw new NoCurrentUserError()
    }
    this.currentUser = this.global.currentUser || new User({ id: 'guest', firstName: guestName, lastName: '' })

    const { resubmit } = this.$f7route.query

    if (!userId) { throw 'userId missing in url' }

    if (userId === 'seq') {
      this.isSequence = true
    } else if (userId === 'guest') {
      this.isGuest = true
    } else {
      getUser(userId).then((user) => {
        this.setState({ targetUser: user, isLoaded: true })
      })
    }

    this.isResubmit = resubmit === 'true'

    this.state = {
      isLoaded: this.isSequence || this.isGuest,
      hasFever: false,
      hasChills: false,
      hasNewCough: false,
      hasDifficultyBreathing: false,
      hasLossTasteSmell: false,
      hasHeadache: false,
      hasDiarhea: false,
      hasSoreThroat: false,
      diagnosisDate: null,
      hadDiagnosis: null,
      contactDate: null,
      hadContact: null,
      showConfirmation: false,
      targetUser: userId === 'guest' ? this.currentUser : null,
      noSymptoms: false,
    }
  }

  redirect(): string | null {
    return this.$f7route.query.redirect || null
  }

  medicalEvents(): Partial<MedicalEvent>[] {
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
    if (this.state.hasHeadache) {
      events.push({
        eventType: MedicalEventTypes.HEADACHE,
        occurredAt: DateTime.local(),
      })
    }
    if (this.state.hasDiarhea) {
      events.push({
        eventType: MedicalEventTypes.DIARHEA,
        occurredAt: DateTime.local(),
      })
    }
    if (this.state.hasSoreThroat) {
      events.push({
        eventType: MedicalEventTypes.SORE_THROAT,
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
      hasHeadache: false,
      hasDiarhea: false,
      hasSoreThroat: false,
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
      && !this.state.hasDiarhea
      && !this.state.hasSoreThroat
      && !this.state.hasHeadache
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
      let status
      if (this.isGuest) {
        status = await createGuestSymptomSurvey(this.guestName, medicalEvents)
      } else {
        status = await createSymptomSurvey(target, medicalEvents)
      }

      if (!status) {
        throw 'This should never happen, but status was somehow nil.'
      }

      if (this.isGuest) {
        this.$f7.dialog.close()
        this.$f7router.navigate(paths.guestPassPath)
        return
      }

      const user = await reloadCurrentUser()

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
        && !this.state.hasLossTasteSmell
        && !this.state.hasDiarhea
        && !this.state.hasSoreThroat
        && !this.state.hasHeadache,
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

    if (!submittingFor) {
      return <Page />
    }

    let pageTitle = tr({
      en: `Daily Check-ins: ${submittingFor.fullName()}`,
      es: `Encuesta de síntomas: ${submittingFor.fullName()}`,
    })

    if (this.isResubmit) {
      pageTitle = tr({
        en: `Resubmit Survey: ${submittingFor.fullName()}`,
        es: `Encuesta de síntomas: ${submittingFor.fullName()}`,
      })
    }

    return (
      <Page>
        <Navbar title={pageTitle} />

        {this.state.isLoaded ? (
          <>
            <Block>
              { this.isResubmit && (
              <p>
                <Tr>
                  <En>
                    This only adds new symptoms to your current submission. To undo a submission, please contact your school administator.
                  </En>
                  <Es>
                    Esto agrega nuevos síntomas a su envío reciente. No puede no cambiar los síntomas que ya envió.
                  </Es>
                </Tr>
              </p>
              ) }

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
                  en: 'Loss of<br />Taste/Smell',
                  es: 'Pérdida de<br/>gusto/olfato',
                })}
                image="tasteSmell"
                onClick={() => this.toggleSymptom('hasLossTasteSmell')}
                selected={this.state.hasLossTasteSmell}
              />
              <SymptomButton
                title={tr({ en: 'Severe Headache', es: 'Dolor de cabeza<br />intenso' })}
                image="headache"
                onClick={() => this.toggleSymptom('hasHeadache')}
                selected={this.state.hasHeadache}
              />
              <SymptomButton
                title={tr({ en: 'Diarhea<br />or Vomiting', es: 'Diarrea <br /> o vómitos' })}
                image="diarhea"
                onClick={() => this.toggleSymptom('hasDiarhea')}
                selected={this.state.hasDiarhea}
              />
              <SymptomButton
                title={tr({ en: 'Sore Throat', es: 'Dolor de garganta' })}
                image="soreThroat"
                onClick={() => this.toggleSymptom('hasSoreThroat')}
                selected={this.state.hasSoreThroat}
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
                <Tr en="COVID Diagnosis?" es="Diagnóstico de COVID" />
              </div>
              {this.isSubmittingForSelf() ? (
                <Tr>
                  <En>Have you been diagnosed with or tested positive for COVID-19?</En>
                  <Es>¿Le han diagnosticado COVID-19 o ha dado positivo en la prueba?</Es>
                </Tr>
              ) : (
                <Tr>
                  <En>Has {submittingFor.firstName} been diagnosed with or tested positive for COVID-19?</En>
                  <Es>¿Se ha {submittingFor.firstName} diagnosticado o dado positivo por COVID-19?</Es>
                </Tr>
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
                      <Tr>
                        <En>Continue to {this.nextUser()?.firstName}</En>
                        <Es>Continua a {this.nextUser()?.firstName}</Es>
                      </Tr>
                    </Button>
                  </When>
                  <When value={false}>
                    <Button fill onClick={() => this.submit1()}>
                      <Tr en="Finish" es="Finalizar" />
                    </Button>
                  </When>
                </Case>
              )}
              {this.state.showConfirmation && (
                <Button fill onClick={() => this.submit2()}>
                  <Tr en="Are you sure?" es="¿Esta seguro?" />
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
