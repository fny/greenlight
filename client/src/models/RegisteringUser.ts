import { GLLocales } from 'src/i18n'
import { Roles } from './LocationAccount'

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

  isStudent: boolean | null = null
  registrationCode: string = ''

  role: Roles = Roles.Unknown

  locale: GLLocales = 'en'

  children: RegisteringUser[] = []
}
