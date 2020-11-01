import React from 'reactn'

import {
  Row,
  Col,
  Segmented,
  Button, ListInput, List,
} from 'framework7-react'

import { DateTime } from 'luxon'
import { defineMessage, Trans } from '@lingui/macro'

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
    date: null,
  }

  errorMessage() {
    if (!this.props.showErrors) {
      return <></>
    }
    if (this.state.yesNo === null) {
      return <Trans id="DatedYesNoButton.yes_no_missing">Please choose yes or no.</Trans>
    }

    if (this.state.yesNo === true && this.state.date === null) {
      return <Trans id="DatedYesNoButton.date_missing">Please set the date.</Trans>
    }
    return <></>
  }

  render() {
    return (
      <>
        <Row>
          <Col width="50">
            <Segmented tag="p">
              <Button
                outline
                fill={this.state.yesNo === true}
                onClick={() => {
                  this.setState({ yesNo: true })
                  this.props.setYesNo(true)
                }}
              >
                <Trans id="DatedYesNoButton.yes">Yes</Trans>
              </Button>
              <Button
                outline
                fill={this.state.yesNo === false}
                onClick={() => {
                  this.setState({ yesNo: false })
                  this.props.setYesNo(false)
                }}
              >
                <Trans id="DatedYesNoButton.no">No</Trans>
              </Button>
            </Segmented>
          </Col>
          <Col width="50">
            <List noHairlinesMd style={{ margin: '0', visibility: this.state.yesNo === true ? 'visible' : 'hidden' }}>
              <ListInput
                label="When?"
                calendarParams={{
                  minDate: DateTime.local().minus({ days: 14 }).toJSDate(),
                  maxDate: DateTime.local().toJSDate(),
                  monthPicker: false,
                  yearPicker: false,
                  closeOnSelect: true,
                  touchMove: false,
                  direction: 'horizontal',
                }}
                onCalendarChange={(d) => {
                  this.setState({ date: d[0] })
                  this.props.setDate(d[0])
                }}
                type="datepicker"
                placeholder={this.global.i18n._(defineMessage({ id: 'DatedYesNoButton.select_date', message: 'Select date' }))}
                readonly
              />
            </List>
          </Col>
          <p style={{ marginTop: '-10px', color: 'var(--f7-input-error-text-color)' }}>
            {this.errorMessage() && <span>{this.errorMessage()}</span> }
          </p>
        </Row>

      </>
    )
  }
}
