import { DateTime } from 'luxon'
import {
  Model, attribute as attr, initialize, STRING, BOOLEAN, NUMBER, DATETIME,
} from './Model'

export enum LocationCategories {
  SCHOOOL = 'school',
  RESTAUARNT = 'restaurant',
  ENTERTAINMENT = 'enterainment',
  NONPROFIT = 'nonprofit',
  RETAIL = 'retail',
  SERVICES = 'services',
  BUSINESS = 'business',
  OTHER = 'other',
}

export const LOCATION_CATEGORIES: LocationCategories[] = [
  LocationCategories.SCHOOOL,
  LocationCategories.RESTAUARNT,
  LocationCategories.ENTERTAINMENT,
  LocationCategories.NONPROFIT,
  LocationCategories.RETAIL,
  LocationCategories.SERVICES,
  LocationCategories.BUSINESS,
  LocationCategories.OTHER,
]

export class Location extends Model {
  static modelName = 'location'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING })
  name: string | null = null

  @attr({ type: STRING })
  phoneNumber: string | null = null

  @attr({ type: STRING })
  website: string | null = null

  @attr({ type: STRING })
  permalink: string | null = null

  @attr({ type: STRING })
  category: LocationCategories | null = null

  @attr({ type: STRING })
  email: string | null = null

  @attr({ type: STRING })
  zipCode: string | null = null

  @attr({ type: BOOLEAN })
  hidden = true

  @attr({ type: NUMBER })
  dailyReminderTime = 7

  @attr({ type: BOOLEAN })
  remindMon = false

  @attr({ type: BOOLEAN })
  remindTue = false

  @attr({ type: BOOLEAN })
  remindWed = false

  @attr({ type: BOOLEAN })
  remindThu = false

  @attr({ type: BOOLEAN })
  remindFri = false

  @attr({ type: BOOLEAN })
  remindSat = false

  @attr({ type: BOOLEAN })
  remindSun = false

  @attr({ type: DATETIME })
  approvedAt = DateTime.fromISO('')

  @attr({ type: NUMBER })
  employeeCount: number | null = null

  @attr({ type: STRING })
  registrationCode: string | null = ''
}
