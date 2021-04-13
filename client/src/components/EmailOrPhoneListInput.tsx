import React from 'reactn'
import { ListInput } from 'framework7-react'
import { validEmail, validPhone } from 'src/helpers/util'
import { tr } from './Tr'

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
    value: String(this.props.value),
  }

  validate(value: string): boolean {
    if (value === '') {
      this.setState({
        inputType: 'blank',
        errorMessage: tr({
          es: 'Proporciona un teléfono o correo electrónico',
          en: 'Please enter your email or mobile number.',
        }),
      })
      this.setState({ errorMessageForce: true })
      return false
    }
    if (validEmail(value)) {
      this.setState({ inputType: 'email' })
    }

    if (validPhone(value)) {
      this.setState({ inputType: 'phone' })
    }

    if (!validEmail(value) && !validPhone(value)) {
      this.setState({
        inputType: 'unknown',
        errorMessage: tr({
          en: 'Invalid email or mobile number.',
          es: 'Proporciona un teléfono o correo electrónico válido.',
        }),
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
        value={this.state.value}
        validateOnBlur
        onBlur={this.onBlur.bind(this)}
        onChange={this.onChange.bind(this)}
        autocomplete="off"
        autocapitalize="off"
        spellcheck="off"
        autocorrect="off"
        errorMessage={this.state.errorMessage}
        errorMessageForce={this.state.errorMessageForce}
        placeholder={
            tr({ es: 'Correo electrónico o número de teléfono móvil', en: 'Email or mobile phone number.' })
          }
        onInput={this.props.onInput}
      />
    )
  }
}
