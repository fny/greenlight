import { Model, attribute as attr, relationship, initialize, STRING, DATETIME, DATE } from './Model'
import moment, { Moment } from 'moment'
import { Location } from './Location'
import { GreenlightStatus } from './GreenlightStatus'
import { MedicalEvent, findLastEvent, hasEvent } from './MedicalEvent'
import { LocationAccount } from './LocationAccount'
import { conjungtify } from '../util'

export class User extends Model {
  static singular = 'user'
  static plural = 'users'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING })
  firstName = ''

  @attr({ type: STRING })
  lastName = ''

  @attr({ type: STRING })
  email: string | null = null

  @attr({ type: DATETIME })
  emailConfirmedAt: string | null = null

  @attr({ type: STRING })
  mobileNumber: string | null = null

  @attr({ type: STRING })
  mobileCarrier: string | null = null

  @attr({ type: STRING })
  mobileNumberUnconfirmed: string | null = null

  @attr({ type: STRING })
  zipCode: string | null = null

  @attr({ type: STRING })
  physicianName: string | null = null

  @attr({ type: STRING })
  physicianPhoneNumber: string | null = null

  @attr({ type: STRING })
  language: string | null = null

  @attr({ type: STRING })
  dailyReminderType: string | null = null

  // TODO: Date type
  @attr({ type: DATE })
  birthDate: string | null = null

  @attr({ type: DATETIME })
  acceptedTermsAt: moment.Moment | null = null

  @attr({ type: DATETIME })
  completedInviteAt: moment.Moment | null = null

  @relationship({ type: 'hasMany', model: 'locationAccount'})
  locationAccounts: LocationAccount[] = []

  @relationship({ type: 'hasMany', model: 'location' })
  locations: Location[] = []

  @relationship({ type: 'hasMany', model: 'user' })
  children: User[] = []

  @relationship({ type: 'hasMany', model: 'user' })
  parents: User[] = []

  @relationship({ type: 'hasMany', model: 'medicalEvent' })
  medicalEvents: MedicalEvent[] = []

  @relationship({ type: 'hasMany', model: 'medicalEvent' })
  recentMedicalEvents: MedicalEvent[] = []

  @relationship({ type: 'hasMany', model: 'greenlightStatus' })
  greenlightStatuses: GreenlightStatus[] = []

  @relationship({ type: 'hasMany', model: 'greenlightStatus' })
  recentGreenlightStatuses: GreenlightStatus[] = []

  @relationship({ type: 'hasOne', model: 'greenlightStatus' })
  lastGreenlightStatus: GreenlightStatus | null = null

  sortedChildren() {
    return this.children.sort((a, b) => (a < b) ? 1 : -1)
  }

  locations_TODO() {
    return this.locationAccounts.map(la => la.location).filter(l => l !== null || l !== undefined)
  }

  /**
   * Locations a user has accounts with along with accounts through children
   */
  affiliatedLocations() {
    const childLocations = this.children.map(x => x.locations_TODO()
    const myLocations = this.locations_TODO()
    myLocations
  }

  findChild(id: string) {
    const found = this.children.filter(c => c.id === id)
    if (found.length === 0) return null
    return found[0]
  }

  // numChildren() {
  //   return this.children.length
  // }

  // hasOneChild() {
  //   return this.numChildren() == 1
  // }

  // hasManyChildren() {
  //   return this.numChildren() > 1
  // }

  fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  hasChildren() {
    return this.children.length > 0
  }

  hasLocationThatRequiresSurvey() {
    return this.locationAccounts.length > 0
  }

  isParent() {
    return this.hasChildren()
  }

  // TODO: Rename,
  needsToSubmitOwnSurvey() {
    return this.greenlightStatus().isUnknown() && this.hasLocationThatRequiresSurvey()
  }

  usersNeedingSurveys(): User[] {
    const users = []
    if (this.needsToSubmitOwnSurvey()) {
      users.push(this)
    }
    for (const child of this.sortedChildren()) {
      if (child.needsToSubmitOwnSurvey()) {
        users.push(child)
      }
    }
    return users
  }

  usersNeedingSurveysText(): string {
    // TODO: i18n
    return conjungtify(this.usersNeedingSurveys().map(u =>
      u === this ? 'yourself' : u.firstName
    ), 'and')
  }


  needsToSubmitSomeonesSurvey(): boolean {
    return this.usersNeedingSurveys().length > 0
  }

  accountFor(location: Location | string) {
    const locationId = typeof location === 'string' ? location : location.id

    const foundAccounts = this.locationAccounts.filter(account => account.locationId === locationId)
    if (foundAccounts.length === 0) { return null }
    return foundAccounts[0]
  }

  roleFor(location: Location | string) {
    const account = this.accountFor(location)
    if (account === null) return 'unassigned'
    return account.role
  }

  hasCompletedWelcome() {
    return this.completedInviteAt !== null && this.completedInviteAt.isValid()
  }

  greenlightStatus() {
    if (this.greenlightStatuses.length === 0) {
      return new GreenlightStatus({ status: GreenlightStatus.STATUSES.UNKNOWN })
    }
    return this.greenlightStatuses[-1]
  }
}
