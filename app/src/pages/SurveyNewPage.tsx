import React from 'reactn'
import { Page, Navbar, Block, Button, Input, Row, Col, ListInput } from 'framework7-react'
import { Case, When } from '../components/Case'
import './SurveyNewPage.css'
import DatedYesNoButton from '../components/DatedYesNoButton'
import { dynamicPaths, paths } from 'src/routes'
import { MEDICAL_EVENTS } from 'src/common/models/MedicalEvent'
import { CUTOFF_TIME, GREENLIGHT_STATUSES } from 'src/common/models/GreenlightStatus'
import { createSymptomSurvey } from 'src/common/api'
import { User } from 'src/common/models'
import { NoCurrentUserError } from 'src/common/errors'
import { ReactNComponent } from 'reactn/build/components'
import { DateTime } from 'luxon'
import { i18n } from '@lingui/core'
import { Trans, t } from '@lingui/macro'


interface SymptomButtonProps {
  title: string
  image: string
  selected?: boolean
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

function SymptomButton({ title, image, selected, onClick }: SymptomButtonProps) {
  return (
    <div
      className={`SymptomButton ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <img alt={title} src={`/images/symptoms/${image}.svg`} />
      <img alt={title} src={`/images/symptoms/${image}-bright.svg`} />
      <br />
      <span dangerouslySetInnerHTML={{ __html: title }}></span>
    </div>
  )
}

interface SurveyProps {
  currentUser: User
  userId: string
}

interface SurveyState {
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
  currentUser: User
}

type Symptoms =
  | "hasFever"
  | "hasChills"
  | "hasNewCough"
  | "hasDifficultyBreathing"
  | "hasLossTasteSmell"

export default class SurveyNewPage extends ReactNComponent<SurveyProps, SurveyState> {
  constructor(props: SurveyProps) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }

    this.state = {
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
      currentUser: this.global.currentUser
    }
  }

  medicalEvents() {
    const events = []
    if (this.state.hasFever) {
      events.push({
        eventType: MEDICAL_EVENTS.FEVER,
        occurredAt: DateTime.local()
      })
    }
    if (this.state.hasChills) {
      events.push({
        eventType: MEDICAL_EVENTS.CHILLS,
        occurredAt: DateTime.local()
      })
    }
    if (this.state.hasNewCough) {
      events.push({
        eventType: MEDICAL_EVENTS.NEW_COUGH,
        occurredAt: DateTime.local()
      })
    }
    if (this.state.hasDifficultyBreathing) {
      events.push({
        eventType: MEDICAL_EVENTS.DIFFICULTY_BREATHING,
        occurredAt: DateTime.local()
      })
    }
    if (this.state.hasLossTasteSmell) {
      events.push({
        eventType: MEDICAL_EVENTS.LOST_TASTE_SMELL,
        occurredAt: DateTime.local()
      })
    }
    if (this.state.hadDiagnosis && this.state.diagnosisDate) {
      events.push({ eventType: MEDICAL_EVENTS.COVID_DIAGNOSIS,
        occurredAt: DateTime.local(this.state.diagnosisDate)
      })
    }
    if (this.state.hadContact && this.state.contactDate) {
      events.push({ eventType: MEDICAL_EVENTS.COVID_EXPOSURE,
        occurredAt: DateTime.local(this.state.contactDate)
      })
    }
    console.log(events)
    return events
  }

  index() {
    const rawId = this.$f7route.params['id']
    if (!rawId) throw new Error('User id missing')
    return parseInt(rawId)
  }

  submittingFor() {
    if (CUTOFF_TIME.isAfter(DateTime.local())) {
      return this.state.currentUser.allUsersNotSubmitted()[this.index()]
    } else {
      return this.state.currentUser.allUsersNotSubmittedForTomorrow()[this.index()]
    }
  }

  submittingBy() {
    return this.state.currentUser
  }

  isSubmittingForSelf() {
    return this.submittingFor() == this.state.currentUser
  }

  isSubmittingForChild() {
    if (this.isSubmittingForSelf()) return false
    return true
  }

  hasNextChild() {
    return this.index() + 1 < (this.state.currentUser.children.length || 0)
  }

  nextChild() {
    if (!this.hasNextChild()) {
      return null
    }
    return this.state.currentUser.children[this.index() + 1]
  }

  childCount() {
    return this.state.currentUser.children.length
  }

  setContacted(yesNo: boolean) {
    this.setState({
      showConfirmation: false,
      hadContact: yesNo
    })
  }

  setDiagnosed(yesNo: boolean) {
    this.setState({
      showConfirmation: false,
      hadDiagnosis: yesNo
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
      submitClicked: true
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

    // TODO: i18n
    this.$f7.dialog.preloader('Submitting...')
    try {
      const status = await createSymptomSurvey(this.submittingFor(), medicalEvents)
      if (!status) {
        throw "This should never happen, but status was somehow nil."
      }
      this.$f7.dialog.close()
      this.$f7router.navigate(paths.surveysThankYouPath)
    } catch (error) {
      if (!error.response) {
        throw error
      }

      if (error.response.status == 422) {
        this.$f7router.navigate(paths.dashboardPath)
      }

      this.$f7.dialog.close()
      console.error(error)
      // TODO: i18n
      this.$f7.dialog.alert('Something went wrong. Maybe someone already submitted?', 'Submission Failed')
    }
  }

  validate() {
    const errors = [
      this.state.hadContact === null,
      this.state.hadContact === undefined,
      this.state.hadDiagnosis === null,
      this.state.hadDiagnosis === undefined,
      this.state.hadContact === true &&
      !this.state.contactDate,
      this.state.hadDiagnosis === true &&
      !this.state.diagnosisDate
    ]
    return !errors.includes(true)
  }

  render() {
    const user = this.state.currentUser
    if (!user) {
      // TODO: Flash message
      this.$f7router.navigate('/')
      return
    }
    const submittingFor = this.submittingFor()
    return (
      <Page>
        <Navbar
          title={i18n._(t('SurveyNewPage.survey')`Symptom Survey`)}
          backLink={i18n._(t('SurveyNewPage.back')`Back`)}>
        </Navbar>
        <Block>
          <div className="survey-title">
            {
              this.isSubmittingForSelf() ?
              <Trans id="SurveyNewPage.any_symptoms">
                Do you have any of these symptoms?
              </Trans>
              :
              <Trans id="SurveyNewPage.any_symptoms_child">
                Does {submittingFor.firstName} have any of these symptoms?
              </Trans>
            }
          </div>
        </Block>
        <div className="SymptomButtons">
          <SymptomButton
            title={i18n._(t('SurveyNewPage.fever')`Fever`)}
            image="fever"
            onClick={() => this.toggleSymptom('hasFever')}
            selected={this.state.hasFever}
          />
          <SymptomButton
            title={i18n._(t('SurveyNewPage.chills')`Chills`)}
            image="chills"
            onClick={() => this.toggleSymptom('hasChills')}
            selected={this.state.hasChills}
          />
          <SymptomButton
            title={i18n._(t('SurveyNewPage.new_cough')`New Cough`)}
            image="cough"
            onClick={() => this.toggleSymptom('hasNewCough')}
            selected={this.state.hasNewCough}
          />
          <SymptomButton
            title={i18n._(t('SurveyNewPage.difficulty_breathing')`Difficulty<br />Breathing`)}
            image="difficulty-breathing"
            onClick={() => this.toggleSymptom('hasDifficultyBreathing')}
            selected={this.state.hasDifficultyBreathing}
          />
          <SymptomButton
            title={i18n._(t('SurveyNewPage.loss_of_smell')`Loss of<br />Taste/Smell`)}
            image="taste-smell"
            onClick={() => this.toggleSymptom('hasLossTasteSmell')}
            selected={this.state.hasLossTasteSmell}
          />
        </div>
        <Block style={{marginTop: 0}}>
          <div className="survey-title">
            <Trans id="SurveyNewPage.covid_contact_title">COVID Contact?</Trans>
          </div>
            {
              this.isSubmittingForSelf() ?
              <Trans id="SurveyNewPage.covid_contact">
                Have you had close contact—within 6 feet for at least 15
                minutes—with someone diagnosed with COVID-19?
              </Trans>
              :
              <Trans id="SurveyNewPage.covid_contact_child">
                Has {submittingFor.firstName} had close contact—within 6 feet for at least 15
                minutes—with someone diagnosed with COVID-19?
              </Trans>
            }
          <br />
          <DatedYesNoButton
            setYesNo={(yesNo: boolean ) => this.setContacted(yesNo)}
            setDate={(date: Date) => this.setContactDate(date)}
            showErrors={this.state.submitClicked}
          />
          <div className="survey-title">
            <Trans id="SurveyNewPage.covid_diagnosis_title">COVID Diagnosis?</Trans>
          </div>
            {
              this.isSubmittingForSelf() ?
              <Trans id="SurveyNewPage.covid_diagnosis">
                Have you been diagnosed with or tested positive for COVID-19?
              </Trans>
              :
              <Trans id="SurveyNewPage.covid_diagnosis_child">
                Has {submittingFor.firstName} been diagnosed with or tested positive for
                COVID-19?
              </Trans>
            }
          <DatedYesNoButton
            setYesNo={(yesNo: boolean ) => this.setDiagnosed(yesNo)}
            setDate={(date: Date) => this.setDiagnosisDate(date)}
            showErrors={this.state.submitClicked}
          />


          <br />
          {!this.state.showConfirmation &&
          <Case test={this.hasNextChild()}>
            <When value={true}>
              <Button
                fill onClick={
                  () => this.submit1()
                }
              >
                <Trans id="SurveyNewPage.continue">
                  Continue to {this.nextChild()?.firstName}
                </Trans>
              </Button>
            </When>
            <When value={false}>
              <Button fill onClick={
                () => this.submit1()
              }>
                <Trans id="SurveyNewPage.finish">Finish</Trans>
              </Button>
            </When>
          </Case>}
          {this.state.showConfirmation &&
            <Button fill onClick={
              () => this.submit2()
            }>
              <Trans id="SurveyNewPage.confirmation">Are you sure?</Trans>
            </Button>
          }
        </Block>
      </Page>
    )
  }
}
