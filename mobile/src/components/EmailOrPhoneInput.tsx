import React from 'react'
import { ListInput, Input, List } from 'framework7-react'
import { validEmail, validPhoneNumber } from '../util'
import { timeStamp } from 'console'

interface Props {
  value: string
}

interface State {
  seenInput: boolean
  errorMessage: string
  errorMessageForce: boolean
  value: string
}

export default class ListEmailOrPhoneInput extends React.Component<Props, State> {
  state: State = {
    seenInput: false,
    errorMessage: '',
    errorMessageForce: false,
    value: ''
  }

  validate(value: string) {
    if (value === '') {
      this.setState({
        errorMessage: 'Please enter your email or mobile number.',
      })
      this.setState({ errorMessageForce: true })
      return
    }

    if (!validEmail(value) && !validPhoneNumber(value)) {
      this.setState({ errorMessage: 'Invalid email or mobile number.' })
      this.setState({ errorMessageForce: true })
      return
    }

    this.setState({ errorMessage: '' })
    this.setState({ errorMessageForce: false })
  }

  onBlur(e: React.ChangeEvent<HTMLInputElement>) {
    if (this.state.seenInput === false) this.setState({ seenInput: true })
    this.validate(e.target.value)
  }

  onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ value: e.target.value })
    if (this.state.seenInput) this.validate(e.target.value)
  }

  render() {
    return (
        <ListInput
          type="text"
          onBlur={this.onBlur.bind(this)}
          onChange={this.onChange.bind(this)}
          errorMessage={this.state.errorMessage}
          errorMessageForce={this.state.errorMessageForce}
          placeholder="Email or mobile phone number"
        />
    )
  }
}
