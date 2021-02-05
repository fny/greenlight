import { DateTime } from 'luxon'
import { getGlobal } from 'reactn'
import {
  Model, attribute as attr, initialize, STRING, BOOLEAN, NUMBER, DATETIME,
} from 'src/lib/Model'

export enum LocationCategories {
  BUSINESS = 'business',
  SCHOOL = 'school',
  COLLEGE = 'college',
  CHURCH = 'church',
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
  SYNAGOGUE = 'synagogue',
  THEATER = 'theater',
  UNIVERSITY = 'university',
  UTILITY = 'utility',
  LOCATION = 'location',
}

type CategoryTranlsations = { [key in LocationCategories]: string[] }
// HACK: We need a proper way to organize translations like this
const LC: CategoryTranlsations = {
  [LocationCategories.BUSINESS]: ['business', 'negocio'],
  [LocationCategories.SCHOOL]: ['school', 'escuela'],
  [LocationCategories.COLLEGE]: ['college', 'universidad'],
  [LocationCategories.CHURCH]: ['church', 'iglesia'],
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
  [LocationCategories.SYNAGOGUE]: ['synagogue', 'sinagoga'],
  [LocationCategories.SHELTER]: ['shelter', 'refugio'],
  [LocationCategories.STORE]: ['store', 'tienda'],
  [LocationCategories.THEATER]: ['theater', 'teatro'],
  [LocationCategories.UNIVERSITY]: ['university', 'universidad'],
  [LocationCategories.UTILITY]: ['utility', 'utilidad'],
  [LocationCategories.LOCATION]: ['location', 'ubicación'],
}

// HACK: We need a proper way to organize translations like this
export function lcTrans(category: LocationCategories | null): string {
  const { locale } = getGlobal()
  return LC[category || LocationCategories.LOCATION][locale === 'en' ? 0 : 1]
}

export function lcPeople(category: LocationCategories | null): string {
  const { locale } = getGlobal()
  if (!category) {
    return locale === 'en' ? 'people' : 'personas'
  }

  if ([LocationCategories.SCHOOL, LocationCategories.UNIVERSITY, LocationCategories.COLLEGE].includes(category)) {
    return locale === 'en' ? 'students and staff' : 'estudiantes y empleados'
  }

  if ([LocationCategories.COMMUNITY, LocationCategories.GROUP, LocationCategories.ORGANIZATION, LocationCategories.SHELTER, LocationCategories.PLACE_OF_WORSHIP, LocationCategories.CHURCH, LocationCategories.SYNAGOGUE].includes(category)) {
    return locale === 'en' ? 'people' : 'personas'
  }

  return locale === 'en' ? 'employees' : 'empleados'
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

  @attr({ type: BOOLEAN })
  remindersEnabled = true

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

  isSchool(): boolean {
    return this.category === LocationCategories.SCHOOL
  }
}
