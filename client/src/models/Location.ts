import { DateTime } from 'luxon'
import {
  Model, attribute as attr, initialize, STRING, BOOLEAN, NUMBER, DATETIME,
} from 'src/lib/Model'

export enum LocationCategories {
  BUSINESS = 'business',
  SCHOOL = 'school',
  CLINIC = 'clinic',
  COMMUNITY = 'community',
  CONSTRUCTION_SITE = 'construction_site',
  HOSPITAL = 'hospital',
  HOTEL = 'hotel',
  NONPROFIT = 'nonprofit',
  PLACE_OF_WORSHIP = 'place_of_worship',
  RESTAUARNT = 'restaurant',
  SHELTER = 'shelter',
  STORE = 'store',
  THEATER = 'theater',
  UNIVERSITY = 'university',
  LOCATION = 'location',
}

export const LOCATION_CATEGORIES: LocationCategories[] = [
  LocationCategories.BUSINESS,
  LocationCategories.SCHOOL,
  LocationCategories.CLINIC,
  LocationCategories.COMMUNITY,
  LocationCategories.CONSTRUCTION_SITE,
  LocationCategories.HOSPITAL,
  LocationCategories.HOTEL,
  LocationCategories.NONPROFIT,
  LocationCategories.PLACE_OF_WORSHIP,
  LocationCategories.RESTAUARNT,
  LocationCategories.SHELTER,
  LocationCategories.STORE,
  LocationCategories.THEATER,
  LocationCategories.UNIVERSITY,
  LocationCategories.LOCATION,
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

  @attr({ type: STRING })
  parentRegistrationCode: string | null = ''

  registrationWithCodeURL(): string {
    return `glit.me/l/${this.permalink}/code/${this.registrationCode}`
  }

  parentRegistrationWithCodeURL(): string {
    return `glit.me/l/${this.permalink}/code/${this.parentRegistrationCode}`
  }
}
