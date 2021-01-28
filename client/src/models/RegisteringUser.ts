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

  registrationCode: string = ''

  availableRoles: Roles[] = []

  role: Roles = Roles.Unknown

  locale: GLLocales = 'en'

  children: RegisteringUser[] = []

  needsPhysician: boolean = false

  physicianName: string = ''

  physicianPhoneNumber: string = ''

  zipCode: string = ''
}
