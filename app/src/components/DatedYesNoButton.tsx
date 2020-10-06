import React from 'react'

import {
  Row,
  Col,
  Segmented,
  Button, ListInput, List
} from 'framework7-react'
import moment, { Moment } from 'moment'

interface Props {
  showErrors?: boolean
  setYesNo: (yesNo: boolean) => void
  setDate: (date: Date) => void
}

interface State {
  yesNo: boolean | null
  date: Date | null
}

export default class DatedYesNoButton extends React.Component<Props, State> {
  state = {
    yesNo: null,
    date: null
  }

  errorMessage() {
    if (!this.props.showErrors) {
      return
    }
    if (this.state.yesNo === null) {
      return 'Please choose yes or no.'
    }

    if (this.state.yesNo === true && this.state.date === null) {
      return 'Please set the date.'
    }
  }

  render() {
    return (
      <>
      <Row>
        <Col width="50">
          <Segmented tag="p">
            <Button outline fill={this.state.yesNo === true} onClick={() => this.setState({ yesNo: true})}>
              Yes
            </Button>
            <Button
              outline
              fill={this.state.yesNo === false}
              onClick={() =>  {
                this.setState({ yesNo: false })
                this.props.setYesNo(false)
              }}
            >
              No
            </Button>
          </Segmented>
        </Col>
        <Col width="50">
          <List noHairlinesMd style={{margin: '0', visibility: this.state.yesNo === true ? 'visible' : 'hidden'}}>
            <ListInput
              label="When?"
              calendarParams={{
                minDate: moment().subtract(14, 'days').toDate(),
                maxDate: moment().toDate(),
                monthPicker: false,
                yearPicker: false,
                closeOnSelect: true,
                touchMove: false,
                direction: 'horizontal'
              }}
              onCalendarChange={(d) => {
                this.setState({ date: d[0] })
                this.props.setDate(d[0])
              }}
              type="datepicker"
              placeholder="Select date"
              readonly
            />
          </List>
        </Col>
        <p style={{marginTop: '-10px', color: 'var(--f7-input-error-text-color)'}}>
          {this.errorMessage() && <span>{this.errorMessage()}</span> }
        </p>
      </Row>

      </>
    )
  }
}
