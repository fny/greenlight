import { GLLocales } from 'src/i18n'

/**
 * Represents a user that is in the process of registering.
 * Never persisted through the backend.
 */

export enum Roles {
  Unknown = 'unknown',
  Student = 'student',
  Parent = 'parent',
  Teacher = 'teacher',
  Staff = 'stuff',
}

export class RegisteringUser {
  firstName: string = ''

  lastName: string = ''

  email: string = ''

  mobileNumber: string = ''

  password: string = ''

  registrationCode: string = ''

  role: Roles = Roles.Unknown

  locale: GLLocales = 'en'

  children: RegisteringUser[] = []
}
