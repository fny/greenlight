import { DateTime } from 'luxon'
import { GLLocales } from 'src/i18n'
import {
  Model, attribute as attr, initialize, STRING, BOOLEAN, NUMBER, DATETIME,
} from 'src/lib/Model'

export const DURHAM_ZIP_CODES = [
  '27503',
  '27572',
  '27701',
  '27702',
  '27703',
  '27704',
  '27705',
  '27706',
  '27707',
  '27708',
  '27709',
  '27710',
  '27711',
  '27712',
  '27713',
  '27715',
  '27717',
  '27722',
]

export enum LocationCategories {
  BUSINESS = 'business',
  SCHOOL = 'school',
  CLINIC = 'clinic',
  COMMUNITY = 'community',
  CONSTRUCTION_SITE = 'construction_site',
  GROUP = 'group',
  HOSPITAL = 'hospital',
  HOTEL = 'hotel',
  NONPROFIT = 'nonprofit',
  ORGANIZATION = 'organization',
  PLACE_OF_WORSHIP = 'place_of_worship',
  RESTAUARNT = 'restaurant',
  SHELTER = 'shelter',
  STORE = 'store',
  THEATER = 'theater',
  UNIVERSITY = 'university',
  LOCATION = 'location',
}

// HACK: We need a proper way to organize translations like this
const LC = {
  [LocationCategories.BUSINESS]: ['business', 'negocio'],
  [LocationCategories.SCHOOL]: ['school', 'escuela'],
  [LocationCategories.CLINIC]: ['clinic', 'clínica'],
  [LocationCategories.COMMUNITY]: ['community', 'communidad'],
  [LocationCategories.CONSTRUCTION_SITE]: ['construction site', 'sitio construcción'],
  [LocationCategories.GROUP]: ['group', 'grupo'],
  [LocationCategories.HOSPITAL]: ['hospital', 'hospital'],
  [LocationCategories.HOTEL]: ['hotel', 'hotel'],
  [LocationCategories.PLACE_OF_WORSHIP]: ['place of worship', 'casa de adoración'],
  [LocationCategories.NONPROFIT]: ['nonprofit', 'nonprofit'],
  [LocationCategories.ORGANIZATION]: ['organization', 'organización'],
  [LocationCategories.RESTAUARNT]: ['restaurant', 'restaurante'],
  [LocationCategories.SHELTER]: ['shelter', 'refugio'],
  [LocationCategories.STORE]: ['store', 'tienda'],
  [LocationCategories.THEATER]: ['theater', 'teatro'],
  [LocationCategories.UNIVERSITY]: ['university', 'universidad'],
  [LocationCategories.LOCATION]: ['location', 'ubicación'],
}

// HACK: We need a proper way to organize translations like this
export function lcTrans(category: LocationCategories, locale: GLLocales = 'en') {
  return LC[category][locale === 'en' ? 0 : 1]
}

export const LOCATION_CATEGORIES: LocationCategories[] = [
  LocationCategories.BUSINESS,
  LocationCategories.SCHOOL,
  LocationCategories.CLINIC,
  LocationCategories.COMMUNITY,
  LocationCategories.CONSTRUCTION_SITE,
  LocationCategories.GROUP,
  LocationCategories.HOSPITAL,
  LocationCategories.HOTEL,
  LocationCategories.PLACE_OF_WORSHIP,
  LocationCategories.NONPROFIT,
  LocationCategories.ORGANIZATION,
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
    return `glit.me/go/${this.permalink}/code/${this.registrationCode}`
  }

  parentRegistrationWithCodeURL(): string {
    return `glit.me/go/${this.permalink}/code/${this.parentRegistrationCode}`
  }
}
