import * as Yup from 'yup'
import GLPhoneNumber from 'src/helpers/GLPhoneNumber'

declare module 'yup' {
  export interface StringSchema {
    /**
     * Check for phone number validity.
     *
     * @param {String} [errorMessage=DEFAULT_MESSAGE] The error message to return if the validation fails.
     */
    phone(
      errorMessage?: string
    ): StringSchema;
  }
}

const YUP_PHONE_METHOD = 'phone'
Yup.addMethod(Yup.string, YUP_PHONE_METHOD, function yupPhone(
  errorMessage: string = '',
) {
  // eslint-disable-next-line no-nested-ternary
  const errMsg = typeof errorMessage === 'string' && errorMessage
    ? errorMessage
    : '${path} must be a valid phone number.'
  // @ts-ignore
  return this.test(YUP_PHONE_METHOD, errMsg, (value: string) => {
    try {
      return new GLPhoneNumber(value).isValid()
    } catch {
      return false
    }
  })
})
