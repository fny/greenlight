import React from 'react'
import { ListInput } from 'framework7-react'
import { validEmail, validPhoneNumber } from 'src/util'
import { i18n } from 'src/i18n'
import { t } from '@lingui/macro'

export type EmailOrPhoneInputTypes = 'email' | 'phone' | 'blank' | 'unknown'

interface State {
  inputType: EmailOrPhoneInputTypes
  seenInput: boolean
  errorMessage: string
  errorMessageForce: boolean
  value: string
}

export default class EmailOrPhoneListInput extends React.Component<ListInput.Props, State> {
  // Required for this to be collected in the List
  static displayName = 'F7ListItem'
  listInput = React.createRef<ListInput>()
  state: State = {
    inputType: 'blank',
    seenInput: false,
    errorMessage: '',
    errorMessageForce: false,
    value: ''
  }

  validate(value: string): boolean {
    if (value === '') {
      this.setState({
        inputType: 'blank',
        errorMessage: i18n._(
          t('EmailOrPhoneListInput.email_or_phone_missing')
          `Please enter your email or mobile number.`,
        )
      })
      this.setState({ errorMessageForce: true })
      return false
    }
    if (validEmail(value)) {
      this.setState({ inputType: 'email' })
    }

    if (validPhoneNumber(value)) {
      this.setState({ inputType: 'phone' })
    }

    if (!validEmail(value) && !validPhoneNumber(value)) {
      this.setState({
        inputType: 'unknown',
        errorMessage: i18n._(
        t('EmailOrPhoneListInput.email_or_phone_invalid')
          `Invalid email or mobile number.`,
        )
      })
      this.setState({ errorMessageForce: true })
      return false
    }

    this.setState({ errorMessage: '' })
    this.setState({ errorMessageForce: false })
    return true
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
          ref={this.listInput}
          type="text"
          onBlur={this.onBlur.bind(this)}
          onChange={this.onChange.bind(this)}
          errorMessage={this.state.errorMessage}
          errorMessageForce={this.state.errorMessageForce}
          placeholder={
            i18n._(
              t('EmailOrPhoneListInput.email_or_phone_placeholder')
                `Email or mobile phone number`,
              )
          }
          onInput={this.props.onInput}
        />
    )
  }
}
