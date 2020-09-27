import React from 'reactn'
import { Page, Navbar, Block, Button, Input, Row, Col, ListInput } from 'framework7-react'
import { Case, When } from '../components/Case'
import './SurveyNewPage.css'
import DatedYesNoButton from '../components/DatedYesNoButton'
import { dynamicPaths, paths } from 'src/routes'
import { Moment } from 'moment'
import moment from 'moment'

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
  contactError?: string | null
}

type Symptoms =
  | "hasFever"
  | "hasChills"
  | "hasNewCough"
  | "hasDifficultyBreathing"
  | "hasLossTasteSmell"

export default class SurveyNewPage extends React.Component<any, SurveyState> {
  state: SurveyState = {
    hasFever: false,
    hasChills: false,
    hasNewCough: false,
    hasDifficultyBreathing: false,
    hasLossTasteSmell: false,
    diagnosisDate: null,
    hadDiagnosis: null,
    contactDate: null,
    hadContact: null
  }

  index() {
    const rawId = this.$f7route.params['id']
    if (!rawId) throw new Error('User id missing')
    return parseInt(rawId)
  }

  submittingFor() {
    return this.global.currentUser.usersNeedingSurveys()[this.index()]
  }

  submittingBy() {
    return this.global.currentUser
  }

  isSubmittingForSelf() {
    return this.submittingFor() == this.global.currentUser
  }

  isSubmittingForChild() {
    if (this.isSubmittingForSelf()) return false
    return true
  }

  hasNextChild() {
    return this.index() + 1 < this.global.currentUser.children.length
  }

  nextChild() {
    if (!this.hasNextChild()) {
      return null
    }
    return this.global.currentUser.children[this.index() + 1]
  }

  childCount() {
    return this.global.currentUser.children.length
  }

  setContacted(yesNo: boolean) {
    this.setState({
      hadContact: yesNo
    })
  }

  setDiagnosed(yesNo: boolean) {
    this.setState({
      hadDiagnosis: yesNo
    })
  }

  setDiagnosisDate(date: Date) {
    console.log(date)
    this.setState({
      diagnosisDate: moment(date),
    })
  }

  setContactDate(date: Date) {
    console.log(date)
    this.setState({
      contactDate: moment(date),
    })
  }

  toggleSymptom(symptom: Symptoms) {
    this.setState({
      ...this.state,
      [symptom]: !this.state[symptom],
    })
  }
  submit() {
    // paths.surveysThankYouPath
    // dynamicPaths.userSurveysNewIndexPath(this.index() + 1)
    // this.validate()
  }

  render() {
    const submittingFor = this.submittingFor()
    return (
      <Page>
        <Navbar title="Symptom Survey" backLink="Back"></Navbar>
        <Block>
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
        <Block>
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
          />
          
          
          <br />
          <Case test={this.hasNextChild()}>
            <When value={true}>
              <Button
                fill onClick={
                  () => this.submit()
                }
              >
                Continue to {this.nextChild()?.firstName}
              </Button>
            </When>
            <When value={false}>
              <Button fill onClick={
                () => this.submit()
              }>
                Finish
              </Button>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
