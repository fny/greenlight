import * as Yup from 'yup'
import { CountryCode, parsePhoneNumberFromString } from 'libphonenumber-js'

declare module 'yup' {
  export interface StringSchema {
    /**
     * Check for phone number validity.
     *
     * @param {String} [countryCode=IN] The country code to check against.
     * @param {String} [errorMessage=DEFAULT_MESSAGE] The error message to return if the validation fails.
     */
    phone(
      countryCode?: string,
      errorMessage?: string
    ): StringSchema;
  }
}

const YUP_PHONE_METHOD = 'phone'
const CLDR_REGION_CODE_SIZE = 2

const isValidCountryCode = (countryCode: any): boolean => typeof countryCode === 'string'
  && countryCode.length === CLDR_REGION_CODE_SIZE

Yup.addMethod(Yup.string, YUP_PHONE_METHOD, function yupPhone(
  countryCode?: CountryCode,
  errorMessage: string = '',
) {
  // eslint-disable-next-line no-nested-ternary
  const errMsg = typeof errorMessage === 'string' && errorMessage
    ? errorMessage
    : isValidCountryCode(countryCode)
      ? `\${path} must be a valid phone number for region ${countryCode}`
      // eslint-disable-next-line no-template-curly-in-string
      : '${path} must be a valid phone number.'
  // @ts-ignore
  return this.test(YUP_PHONE_METHOD, errMsg, (value: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(value, countryCode)
      if (!phoneNumber) {
        return false
      }

      if (!phoneNumber.isPossible()) {
        return false
      }

      if (!phoneNumber.isValid()) {
        return false
      }

      return true
    } catch {
      return false
    }
  })
})
