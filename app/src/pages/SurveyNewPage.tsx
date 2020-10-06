import React from 'reactn'
import { Page, Navbar, Block, Button, Input, Row, Col, ListInput } from 'framework7-react'
import { Case, When } from '../components/Case'
import './SurveyNewPage.css'
import DatedYesNoButton from '../components/DatedYesNoButton'
import { dynamicPaths } from 'src/routes'
import moment from 'moment'
import { MEDICAL_EVENTS } from 'src/common/models/MedicalEvent'
import { GREENLIGHT_STATUSES } from 'src/common/models/GreenlightStatus'
import { createSymptomSurvey } from 'src/common/api'
import { User } from 'src/common/models'
import { NoCurrentUserError } from 'src/common/errors'
import { ReactNComponent } from 'reactn/build/components'

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
  diagnosisDate: moment.Moment | null
  hadContact: boolean | null
  contactDate: moment.Moment | null
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

  serialize() {
    const events = []
    const status = {
      statusSetAt: moment(),
      statusExpiresAt: moment(null),
      reason: '',
      status: GREENLIGHT_STATUSES.UNKNOWN
    }
    if (this.state.hasFever) {
      events.push({ eventType: MEDICAL_EVENTS.FEVER })
    }
    if (this.state.hasChills) {
      events.push({ eventType: MEDICAL_EVENTS.CHILLS })
    }
    if (this.state.hasNewCough) {
      events.push({ eventType: MEDICAL_EVENTS.NEW_COUGH })
    }
    if (this.state.hasDifficultyBreathing) {
      events.push({ eventType: MEDICAL_EVENTS.DIFFICULTY_BREATING })
    }
    if (this.state.hasLossTasteSmell) {
      events.push({ eventType: MEDICAL_EVENTS.LOST_TASTE_SMELL })
    }
    if (this.state.hadDiagnosis && this.state.diagnosisDate) {
      events.push({ eventType: MEDICAL_EVENTS.COVID_DIAGNOSIS,
        occurredAt: moment(this.state.diagnosisDate)
      })
    }
    if (this.state.hadContact && this.state.contactDate) {
      events.push({ eventType: MEDICAL_EVENTS.COVID_EXPOSURE,
        occurredAt: moment(this.state.contactDate)
      })
    }
    const symptomatic = this.state.hasFever || this.state.hasChills || this.state.hasDifficultyBreathing  || this.state.hasLossTasteSmell || this.state.hasNewCough
    
    // Asymptomatic
    if (!symptomatic && !this.state.hadContact && !this.state.hadDiagnosis) {
      status.status = GREENLIGHT_STATUSES.CLEARED
      status.statusExpiresAt = status.statusSetAt.add(1, 'day')
      return { medicalEvents: events, greenlightStatus: status }
    }

    // Contact
    if (this.state.hadContact) {
      status.status = GREENLIGHT_STATUSES.RECOVERING
      status.statusExpiresAt = status.statusSetAt.add(14, 'day')
      status.reason = 'diagnosis'
      return { medicalEvents: events, greenlightStatus: status }
    }

    // Diagnosis
    if (this.state.hadDiagnosis && symptomatic) {
      status.statusExpiresAt = this.state.diagnosisDate?.add(10, 'day') || status.statusSetAt.add(10, 'day')

      if (status.statusExpiresAt < status.statusSetAt && !this.state.hasFever) {
        status.status = GREENLIGHT_STATUSES.CLEARED
        status.statusExpiresAt = status.statusSetAt.add(1, 'day')
        status.reason = 'diagnosed, beyond 10 days, no fever'
        return { medicalEvents: events, greenlightStatus: status }
      }

      if (status.statusExpiresAt < status.statusSetAt && this.state.hasFever) {
        status.status = GREENLIGHT_STATUSES.RECOVERING
        status.statusExpiresAt = status.statusSetAt.add(1, 'day')
        status.reason = 'diagnosed, beyond 10 days, has fever'
        return { medicalEvents: events, greenlightStatus: status }
      }
      
      status.status = GREENLIGHT_STATUSES.RECOVERING
      status.reason = 'diagnosis'
      return { medicalEvents: events, greenlightStatus: status }
    }

    // Symptomatic
    if (symptomatic) {
      status.status = GREENLIGHT_STATUSES.RECOVERING
      status.statusExpiresAt = status.statusSetAt.add(10, 'day')
      status.reason = 'symptomatic'
      return { medicalEvents: events, greenlightStatus: status }
    }

    throw new Error(`Unhandled case: symptomatic ${symptomatic}, contact ${this.state.hadContact}, diagnosis ${this.state.hadDiagnosis}`)
  }

  index() {
    const rawId = this.$f7route.params['id']
    if (!rawId) throw new Error('User id missing')
    return parseInt(rawId)
  }

  submittingFor() {
    return this.state.currentUser.usersNeedingSurveys()[this.index()]
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
      diagnosisDate: moment(date),
    })
  }

  setContactDate(date: Date) {
    this.setState({
      showConfirmation: false,
      contactDate: moment(date),
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
    const { medicalEvents, greenlightStatus } = this.serialize()
    
    // TODO: i18n
    this.$f7.dialog.preloader('Submitting...')
    try {
      await createSymptomSurvey(this.submittingFor(), medicalEvents, greenlightStatus)
      this.$f7.dialog.close()
      this.$f7router.navigate(dynamicPaths.surveysThankYouPath(greenlightStatus.status))
    } catch (error) {
      if (error.response.status == 422) {
        this.$f7router.navigate('/dashboard')
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
    console.log(errors)
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
        <Navbar title="Symptom Survey" backLink="Back"></Navbar>
        <Block style={{marginBottom: '1em'}}>
          <div className="survey-title">
            {
              this.isSubmittingForSelf() ?
              `Do you have any of these symptoms?`
              :
              `Does ${submittingFor.firstName} have any of these symptoms?`
            }
          </div>
        </Block>
        <div className="SymptomButtons">
          <SymptomButton
            title="Fever"
            image="fever"
            onClick={() => this.toggleSymptom('hasFever')}
            selected={this.state.hasFever}
          />
          <SymptomButton
            title="Chills"
            image="chills"
            onClick={() => this.toggleSymptom('hasChills')}
            selected={this.state.hasChills}
          />
          <SymptomButton
            title="New Cough"
            image="cough"
            onClick={() => this.toggleSymptom('hasNewCough')}
            selected={this.state.hasNewCough}
          />
          <SymptomButton
            title="Difficulty<br />Breathing"
            image="difficulty-breathing"
            onClick={() => this.toggleSymptom('hasDifficultyBreathing')}
            selected={this.state.hasDifficultyBreathing}
          />
          <SymptomButton
            title="Loss of<br />Taste/Smell"
            image="taste-smell"
            onClick={() => this.toggleSymptom('hasLossTasteSmell')}
            selected={this.state.hasLossTasteSmell}
          />
        </div>
        <Block style={{marginTop: 0}}>
          <div className="survey-title">COVID Contact?</div>
            {
              this.isSubmittingForSelf() ?
              `Have you had close contact—within 6 feet for at least 15
              minutes—with someone diagnosed with COVID-19?`
              :
              `Has ${submittingFor.firstName} had close contact—within 6 feet for at least 15
              minutes—with someone diagnosed with COVID-19?`
            }
          <br />
          <DatedYesNoButton
            setYesNo={(yesNo: boolean ) => this.setContacted(yesNo)}
            setDate={(date: Date) => this.setContactDate(date)}
            showErrors={this.state.submitClicked}
          />
          <div className="survey-title">COVID Diagnosis?</div>
            {
              this.isSubmittingForSelf() ?
              `Have you been diagnosed with or tested positive for COVID-19?`
              :
              `Has ${submittingFor.firstName} been diagnosed with or tested positive for
              COVID-19?`
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
                Continue to {this.nextChild()?.firstName}
              </Button>
            </When>
            <When value={false}>
              <Button fill onClick={
                () => this.submit1()
              }>
                Finish
              </Button>
            </When>
          </Case>}
          {this.state.showConfirmation &&
            <Button fill onClick={
              () => this.submit2()
            }>
              Are you sure?
            </Button>
          }
        </Block>
      </Page>
    )
  }
}
