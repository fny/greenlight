import React, { useState, getGlobal } from 'reactn'
import { Row, Col, Page, Navbar, Link, Block, BlockTitle, Segmented, Button } from 'framework7-react'
import fixtures from '../fixtures'
import { Case, When } from '../components/Case'
import './SymptomSurveyPage.css'
import { User } from '../models/user'

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

interface YesNoButtonProps {
  setYesNo: (yesNo: boolean) => void
  yesNo: boolean | null
}

function YesNoButton({ yesNo, setYesNo }: YesNoButtonProps) {
  return (
    <Row>
      <Col width="50">
        <Segmented tag="p">
          <Button outline fill={yesNo === true} onClick={() => setYesNo(true)}>
            Yes
          </Button>
          <Button
            outline
            fill={yesNo === false}
            onClick={() => setYesNo(false)}
          >
            No
          </Button>
        </Segmented>
      </Col>
    </Row>
  )
}

interface SurveyProps {

}

interface SurveyState {
  submittingUser: User
  targetUser: User
  hasFever: boolean
  hasChills: boolean
  hasNewCough: boolean
  hasDifficultyBreathing: boolean
  hasLossTasteSmell: boolean
  hadDiagnosis: boolean | null
  hadContact: boolean | null
}

type Symptoms =
  | "hasFever"
  | "hasChills"
  | "hasNewCough"
  | "hasDifficultyBreathing"
  | "hasLossTasteSmell"

export default class SymptomSurveyPage extends React.Component<SurveyProps, SurveyState> {
  state: SurveyState = {
    submittingUser: fixtures.users.marge,
    targetUser: fixtures.users.lisa,
    hasFever: false,
    hasChills: false,
    hasNewCough: false,
    hasDifficultyBreathing: false,
    hasLossTasteSmell: false,
    hadDiagnosis: null,
    hadContact: null,
  }

  childId() {
    const rawId = this.$f7route.params['id']
    if (!rawId) throw new Error('Child id missing')
    return parseInt(rawId)
  }

  child(): User {
    return this.global.currentUser.children[this.childId() - 1]
  }

  hasNextChild() {
    return this.childId() < this.global.currentUser.children.length
  }

  nextChild() {
    if (!this.hasNextChild()) {
      return null
    }
    return this.global.currentUser.children[this.childId()]
  }

  childCount() {
    return this.global.currentUser.children.length
  }

  submittingForSelf() {
    return this.state.submittingUser == this.state.targetUser
  }

  setHadDiagnosis(yesNo: boolean) {
    this.setState({
      ...this.state,
      hadDiagnosis: yesNo,
    })
  }

  setHadContact(yesNo: boolean) {
    this.setState({
      ...this.state,
      hadContact: yesNo,
    })
  }

  toggleSymptom(symptom: Symptoms) {
    this.setState({
      ...this.state,
      [symptom]: !this.state[symptom],
    })
  }

  render() {
    const child = this.child()
    return (
      <Page>
        <Navbar title="Symptom Survey" backLink="Back"></Navbar>
        <Block>
          <div className="survey-title">
            Does {child.firstName} have any of these symptoms?
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
          <Case test={this.submittingForSelf()}>
            <When value={true}>
              Have you had close contact (within 6 feet for at least 15 minutes)
              with someone diagnosed with COVID-19? Has a health worker advised
              you to quarantine?
            </When>
            <When value={false}>
              Has {child.firstName} had close contact—within 6 feet for at least
              15 minutes—with someone diagnosed with COVID-19? Has a health
              worker advised {child.firstName} to quarantine?
            </When>
          </Case>
          <br />
          <YesNoButton
            setYesNo={(yesNo: boolean) => this.setHadContact(yesNo)}
            yesNo={this.state.hadContact}
          />
          <div className="survey-title">COVID Diagnosis?</div>

          <Case test={this.submittingForSelf()}>
            <When value={true}>
              Have you been diagnosed with or tested positive for COVID-19?
            </When>
            <When value={false}>
              Has {child.firstName} been diagnosed with or tested positive for
              COVID-19?
            </When>
          </Case>
          <YesNoButton
            setYesNo={(yesNo: boolean) => this.setHadDiagnosis(yesNo)}
            yesNo={this.state.hadDiagnosis}
          />
          <br />
          <Case test={this.hasNextChild()}>
            <When value={true}>
              <Button
                href={`/welcome-parent/surveys/children/${this.childId() + 1}`}
                fill
              >
                Continue to {this.nextChild()?.firstName}
              </Button>
            </When>
            <When value={false}>
              <Button fill href={`/welcome-parent/thank-you`}>
                Finish
              </Button>
            </When>
          </Case>
        </Block>
      </Page>
    )
  }
}
