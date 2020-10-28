import React from 'reactn'
import { Page, Navbar, Block, Button, Preloader } from 'framework7-react'
import { Case, When } from '../components/Case'
import './SurveyNewPage.css'
import DatedYesNoButton from '../components/DatedYesNoButton'
import { paths } from 'src/routes'
import { MEDICAL_EVENTS } from 'src/models/MedicalEvent'
import { CUTOFF_TIME } from 'src/models/GreenlightStatus'
import { createSymptomSurvey, getUser } from 'src/api'
import { User } from 'src/models'
import { NoCurrentUserError } from 'src/errors'
import { ReactNComponent } from 'reactn/build/components'
import { DateTime } from 'luxon'
import { defineMessage, t } from '@lingui/macro'
import { MyTrans } from 'src/i18n'
import { assertNotNull } from 'src/util'
import { reloadCurrentUser } from 'src/initializers/providers'


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
  | "hasFever"
  | "hasChills"
  | "hasNewCough"
  | "hasDifficultyBreathing"
  | "hasLossTasteSmell"

export default class SurveyNewPage extends ReactNComponent<SurveyProps, SurveyState> {
  isSequence = false
  currentUser: User

  constructor(props: SurveyProps) {
    super(props)
    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }

    this.currentUser = this.global.currentUser

    const userId = this.$f7route.params['userId']
    if (!userId) { throw "userId missing in url" }

    if (userId === 'seq') {
      this.isSequence = true
    } else {
      getUser(userId).then(user => {
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
      targetUser: null
    }
  }

  redirect() {
    return this.$f7route.query['redirect'] || null
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
        occurredAt: this.state.diagnosisDate
      })
    }
    if (this.state.hadContact && this.state.contactDate) {
      events.push({ eventType: MEDICAL_EVENTS.COVID_EXPOSURE,
        occurredAt: this.state.contactDate
      })
    }
    return events
  }

  submittingFor(): User | null {
    if (this.isSequence) {
      if (CUTOFF_TIME.isAfter(DateTime.local())) {
        return this.currentUser.usersNotSubmitted()[0] || null
      } else {
        return this.currentUser.usersNotSubmittedForTomorrow()[0] || null
      }
    }
    return this.state.targetUser
  }

  isSubmittingForSelf(): boolean {
    return this.submittingFor() == this.currentUser
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

    this.$f7.dialog.preloader(
      this.global.i18n._(defineMessage({ id: 'SurveyNewPage.submitting', message: "Submitting..." }))
    )
    const redirect = this.redirect()
    try {
      // TODO: This should load the data
      const target = this.submittingFor()
      assertNotNull(target)
      const status = await createSymptomSurvey(target, medicalEvents)
      if (!status) {
        throw "This should never happen, but status was somehow nil."
      }
      const user = await reloadCurrentUser() // Reload data
      this.$f7.dialog.close()

      if (redirect) {
        this.$f7router.navigate(redirect, {reloadCurrent: true, ignoreCache: true })
      } else if (this.isSequence && user.usersNotSubmitted().length > 0) {
        this.$f7router.refreshPage()
      } else {
        this.$f7router.navigate(paths.surveysThankYouPath)
      }

    } catch (error) {
      if (!error.response) {
        throw error
      }

      if (error.response.status == 422) {
        if (redirect) {
          this.$f7router.navigate(redirect, { reloadCurrent: true, ignoreCache: true })
        } else {
          this.$f7router.navigate(paths.dashboardPath)
        }

      }

      this.$f7.dialog.close()
      console.error(error)
      // TODO: Make errors smarter
      this.$f7.dialog.alert(
        this.global.i18n._(defineMessage({ id: 'SurveyNewPage.submission_failed_message', message: "Something went wrong. Maybe someone already submitted?" })),
        this.global.i18n._(defineMessage({ id: 'SurveyNewPage.submission_failed_title', message: "Submission Failed" }))
      )
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
    const user = this.currentUser
    if (!user) {
      // TODO: Flash message
      this.$f7router.navigate('/')
      return
    }
    const submittingFor = this.submittingFor()

    if (submittingFor === null) {
      return <Page>
        <Navbar title="Already submitted for today." backLink={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.back', message: "Back" }))} />
        <Block>
          All surveys have already been submitted for today. Please check back later!
        </Block>
      </Page>
    }

    // if (!submittingFor.greenlightStatus().isUnknown()) {
    //   return <Page>
    //     <Navbar title="Already submitted for today." backLink={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.back', message: "Back" }))} />
    //     <Block>
    //       Survey has been submitted for today.
    //     </Block>
    //   </Page>
    // }

    return (
      <Page>
        <Navbar
          title={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.survey', message: t`Symptom Survey: ${submittingFor.fullName()}` }))}
          backLink={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.back', message: "Back" }))}>
        </Navbar>


        {
          this.state.isLoaded ?
          <>
        <Block>
          <div className="survey-title">
            {
              this.isSubmittingForSelf() ?
              <MyTrans id="SurveyNewPage.any_symptoms">
                Do you have any of these symptoms?
              </MyTrans>
              :
              <MyTrans id="SurveyNewPage.any_symptoms_child">
                Does {submittingFor?.firstName} have any of these symptoms?
              </MyTrans>
            }
          </div>
        </Block>
        <div className="SymptomButtons">
          <SymptomButton
            title={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.fever', message: "Fever" }))}
            image="fever"
            onClick={() => this.toggleSymptom('hasFever')}
            selected={this.state.hasFever}
          />
          <SymptomButton
            title={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.chills', message: "Chills" }))}
            image="chills"
            onClick={() => this.toggleSymptom('hasChills')}
            selected={this.state.hasChills}
          />
          <SymptomButton
            title={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.new_cough', message: "New Cough" }))}
            image="cough"
            onClick={() => this.toggleSymptom('hasNewCough')}
            selected={this.state.hasNewCough}
          />
          <SymptomButton
            title={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.difficulty_breathing', message: "Difficulty<br />Breathing" }))}
            image="difficulty-breathing"
            onClick={() => this.toggleSymptom('hasDifficultyBreathing')}
            selected={this.state.hasDifficultyBreathing}
          />
          <SymptomButton
            title={this.global.i18n._(defineMessage({ id: 'SurveyNewPage.loss_of_smell', message: "Loss of<br />Taste/Smell" }))}
            image="taste-smell"
            onClick={() => this.toggleSymptom('hasLossTasteSmell')}
            selected={this.state.hasLossTasteSmell}
          />
        </div>
        <Block style={{marginTop: 0}}>
          <div className="survey-title">
            <MyTrans id="SurveyNewPage.covid_contact_title">COVID Contact?</MyTrans>
          </div>
            {
              this.isSubmittingForSelf() ?
              <MyTrans id="SurveyNewPage.covid_contact">
                Have you had close contact—within 6 feet for at least 15
                minutes—with someone diagnosed with COVID-19?
              </MyTrans>
              :
              <MyTrans id="SurveyNewPage.covid_contact_child">
                Has {submittingFor?.firstName} had close contact—within 6 feet for at least 15
                minutes—with someone diagnosed with COVID-19?
              </MyTrans>
            }
          <br />
          <DatedYesNoButton
            setYesNo={(yesNo: boolean ) => this.setContacted(yesNo)}
            setDate={(date: Date) => this.setContactDate(date)}
            showErrors={this.state.submitClicked}
          />
          <div className="survey-title">
            <MyTrans id="SurveyNewPage.covid_diagnosis_title">COVID Diagnosis?</MyTrans>
          </div>
            {
              this.isSubmittingForSelf() ?
              <MyTrans id="SurveyNewPage.covid_diagnosis">
                Have you been diagnosed with or tested positive for COVID-19?
              </MyTrans>
              :
              <MyTrans id="SurveyNewPage.covid_diagnosis_child">
                Has {submittingFor?.firstName} been diagnosed with or tested positive for
                COVID-19?
              </MyTrans>
            }
          <DatedYesNoButton
            setYesNo={(yesNo: boolean ) => this.setDiagnosed(yesNo)}
            setDate={(date: Date) => this.setDiagnosisDate(date)}
            showErrors={this.state.submitClicked}
          />


          <br />
          {!this.state.showConfirmation &&
          <Case test={this.hasNextUser()}>
            <When value={true}>
              <Button
                fill onClick={
                  () => this.submit1()
                }
              >
                <MyTrans id="SurveyNewPage.continue">
                  Continue to {this.nextUser()?.firstName}
                </MyTrans>
              </Button>
            </When>
            <When value={false}>
              <Button fill onClick={
                () => this.submit1()
              }>
                <MyTrans id="SurveyNewPage.finish">Finish</MyTrans>
              </Button>
            </When>
          </Case>}
          {this.state.showConfirmation &&
            <Button fill onClick={
              () => this.submit2()
            }>
              <MyTrans id="SurveyNewPage.confirmation">Are you sure?</MyTrans>
            </Button>
          }
        </Block>
        </>
        :
        <Preloader />
        }
      </Page>

    )
  }
}
