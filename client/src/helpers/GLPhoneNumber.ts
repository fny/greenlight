import parsePhoneNumberFromString, { PhoneNumber } from 'libphonenumber-js'

const SUPPORTED_COUNTRY_CODES = [
  'US', // US
  'CA', // Canada
  'PR', // Puerto Rico
  'VI', // US Virgin Islands
  'GU', // Guam
  'AS', // American Samoa
  'MP', // Northern Mariana Islands
] as const

export default class GLPhoneNumber {
  _value: string

  _parsed: PhoneNumber | null

  constructor(value: string) {
    this._value = value
    this._parsed = null
    this._parse()
  }

  _parse(): void {
    for (const code of SUPPORTED_COUNTRY_CODES) {
      const parsedOnce = parsePhoneNumberFromString(this._value, code)
      // eslint-disable-next-line no-continue
      if (!parsedOnce) continue
      // We need to do two checks because for some reason Puerto Rico validates
      // 555 numbers
      const parsedTwice = parsePhoneNumberFromString(parsedOnce.number as string, code)
      // eslint-disable-next-line no-continue
      if (!parsedTwice) continue
      this._parsed = parsedTwice
      break
    }
  }

  isValid(): boolean {
    return this._parsed?.isValid() || false
  }

  national(): string {
    return this._parsed?.formatNational() as string || ''
  }

  international(): string {
    return this._parsed?.number as string || ''
  }
}
