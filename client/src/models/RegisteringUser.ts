import { GLLocales } from 'src/i18n'

/**
 * Represents a user that is in the process of registering.
 * Never persisted through the backend.
 */
export class RegisteringUser {
  firstName: string = ''

  lastName: string = ''

  email: string = ''

  mobileNumber: string = ''

  password: string = ''
}
