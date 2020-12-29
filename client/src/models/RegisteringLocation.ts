import { BooleanArraySupportOption } from 'prettier'
import { isBlank } from 'src/helpers/util'
import { LocationCategories } from 'src/models/Location'

/**
 * Represents a location the user is in the process of registering.
 * Never persisted through the backend.
 */
export class RegisteringLocation {
  name: string = ''

  zipCode: string = ''

  email: string = ''

  phoneNumber: string = ''

  website: string = ''

  permalink: string = ''

  category: LocationCategories | null = null

  employeeCount: number | null = null

  dailyReminderHour = 8

  dailyReminderAMPM: 'am' | 'pm' = 'am'

  remindersEnabled = true

  remindMon = true

  remindTue = true

  remindWed = true

  remindThu = true

  remindFri = true

  remindSat = true

  remindSun = true
}

export function hasFinishedStepOne(location: RegisteringLocation): boolean {
  return !isBlank(location.name) && !isBlank(location.zipCode) && !isBlank(location.category) && !isBlank(location.employeeCount)
}
