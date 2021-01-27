import { DateTime } from 'luxon'
import { isPresent, joinWords } from 'src/helpers/util'
import { Cohort, Location, MedicalEvent } from 'src/models'
import {
  Model, attribute as attr, initialize, STRING, DATETIME, DATE, BOOLEAN, hasMany, hasOne,
} from 'src/lib/Model'
import { CUTOFF_TIME, GreenlightStatus } from './GreenlightStatus'
import { LocationAccount } from './LocationAccount'
import { UserSettings } from './UserSettings'

/**
 * Represent a user in the application, be it an employee, owner, parent,
 * teacher, student or administrator.
 */
export class User extends Model {
  static modelName = 'user'

  static reversedNameSort(u1: User, u2: User): number {
    if (u1.reversedName() > u2.reversedName()) return 1
    if (u1.reversedName() < u2.reversedName()) return -1
    return 0
  }

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

  @attr({ type: BOOLEAN })
  needsPhysician: boolean | null = null

  @attr({ type: STRING })
  locale: 'en' | 'es' | null = null

  @attr({ type: DATE })
  birthDate: DateTime | null = DateTime.fromISO('')

  @attr({ type: DATETIME })
  acceptedTermsAt: DateTime = DateTime.fromISO('')

  @attr({ type: DATETIME })
  completedWelcomeAt: DateTime = DateTime.fromISO('')

  @hasMany('Cohort')
  cohorts: Cohort[] = []

  @hasMany('LocationAccount')
  locationAccounts: LocationAccount[] = []

  @hasMany('User')
  children: User[] = []

  @hasMany('User')
  parents: User[] = []

  @hasMany('MedicalEvent')
  medicalEvents: MedicalEvent[] = []

  @hasMany('MedicalEvent')
  recentMedicalEvents: MedicalEvent[] = []

  @hasOne('GreenlightStatus')
  lastGreenlightStatus: GreenlightStatus | null = null

  @hasOne('UserSettings')
  settings: UserSettings | null = null

  reversedName(): string {
    return `${this.lastName}, ${this.firstName}`
  }

  sortedChildren(): User[] {
    return this.children.sort((a, b) => (a.id < b.id ? 1 : -1))
  }

  locations__HACK(): Location[] {
    return this.locationAccounts.map((la) => la.location).filter((l): l is Location => isPresent(l))
  }

  /** The users first name. */
  fullName(): string {
    return `${this.firstName} ${this.lastName}`
  }

  /** Does this user have any children? */
  hasChildren(): boolean {
    return this.children.length > 0
  }

  /** Is this user a parent? */
  isParent(): boolean {
    return this.hasChildren()
  }

  isAdminAt(location: Location): boolean {
    const la = this.accountFor(location)
    if (!la) return false
    return la.isAdmin()
  }

  isOwnerAt(location: Location): boolean {
    const la = this.accountFor(location)
    if (!la) return false
    return la.isOwner()
  }

  accountFor(location: Location): LocationAccount | null {
    return this.locationAccounts.find((la) => (la.locationId || '').toString() === location.id.toString()) || null
  }

  /** Has the user completed the welcome sequence? */
  hasCompletedWelcome() {
    return this.completedWelcomeAt !== null && this.completedWelcomeAt.isValid
  }

  /** The users current greenlight status */
  greenlightStatus(): GreenlightStatus {
    if (!this.lastGreenlightStatus || !this.lastGreenlightStatus.isValidForToday()) {
      const status = GreenlightStatus.newUnknown()
      // 'cleared',
      // 'cleared_alternative_diagnosis',
      // 'cleared_with_symptom_improvement',
      // 'pending_needs_diagnosis',
      // 'recovery_covid_exposure',
      // 'recovery_asymptomatic_covid_exposure',
      // 'recovery_from_diagnosis',
      // 'recovery_not_covid_has_fever',
      // 'recovery_diagnosed_asymptomatic',
      // 'recovery_return_tomorrow'
      return status
    }
    return this.lastGreenlightStatus
  }

  /**
   * The user's greenlight status for tomorrow.
   */
  greenlightStatusTomorrow(): GreenlightStatus {
    if (!this.lastGreenlightStatus || !this.lastGreenlightStatus.isValidForTomorrow()) {
      return GreenlightStatus.newUnknown()
    }
    return this.lastGreenlightStatus
  }

  /** Is this user cleared? */
  isCleared(): boolean {
    return this.greenlightStatus().isCleared()
  }

  /** This inclues this user */
  areUsersCleared(): boolean {
    return this.usersExpectedToSubmit()
      .map((u) => u.isCleared())
      .every((x) => x === true)
  }

  //
  // Survey Related Methods
  //

  /** Has the user not submitted their own survey if its required?  */
  hasNotSubmittedOwnSurvey(): boolean {
    return this.greenlightStatus().isUnknown() && this.hasLocationThatRequiresSurvey()
  }

  /** Has the user not submitted their own survey if its required?  */
  hasNotSubmittedOwnSurveyForTomorrow(): boolean {
    return this.greenlightStatusTomorrow().isUnknown() && this.hasLocationThatRequiresSurvey()
  }

  /**
   * All of the users associated with this user
   * who haven't submitted a survey yet for today
   */
  usersNotSubmitted(): User[] {
    const users = []
    for (const child of this.sortedChildren()) {
      if (child.hasNotSubmittedOwnSurvey()) {
        users.push(child)
      }
    }
    if (this.hasNotSubmittedOwnSurvey()) {
      users.push(this)
    }
    return users
  }

  usersNotSubmittedForTomorrow(): User[] {
    const users = []
    for (const child of this.sortedChildren()) {
      if (child.hasNotSubmittedOwnSurveyForTomorrow()) {
        users.push(child)
      }
    }
    if (this.hasNotSubmittedOwnSurveyForTomorrow()) {
      users.push(this)
    }
    return users
  }

  /**
   * TODO: This needs to be turned into a proper pattern.
   */
  settingsReified() {
    return this.settings || new UserSettings()
  }

  /**
   * The names of all the users needing to submit surveys
   */
  usersNotSubmittedText(): string {
    return joinWords(this.usersNotSubmitted().map((u) => (u === this ? this.yourself__HACK() : u.firstName)))
  }

  /**
   * The names of all the users needing to submit surveys
   */
  usersNotSubmittedForTomorrowText(): string {
    return joinWords(this.usersNotSubmittedForTomorrow().map((u) => (u === this ? this.yourself__HACK() : u.firstName)))
  }

  showSubmissionPanelForToday(): boolean {
    return this.usersNotSubmitted().length > 0 && CUTOFF_TIME.isAfter(DateTime.local())
  }

  showSubmissionPanelForTomorrow(): boolean {
    return this.usersNotSubmittedForTomorrow().length > 0 && CUTOFF_TIME.isBefore(DateTime.local())
  }

  yourself__HACK() {
    return this.locale === 'en' ? 'yourself' : 'su mismo'
  }

  you__HACK() {
    return this.locale === 'en' ? 'you' : 'su'
  }

  hasLocationThatRequiresSurvey() {
    return this.locationAccounts.length > 0
  }

  needsToSubmitSomeonesSurvey(): boolean {
    return this.usersNotSubmitted().length > 0
  }

  usersExpectedToSubmit() {
    const users: User[] = []

    if (this.hasLocationThatRequiresSurvey()) {
      users.push(this)
    }

    for (const child of this.children) {
      if (child.hasLocationThatRequiresSurvey()) {
        users.push(child)
      }
    }
    return users
  }

  isAdminSomewhere(): boolean {
    return this.adminLocations().length > 0
  }

  isOwnerSomewhere(): boolean {
    return this.ownerLocations().length > 0
  }

  ownerLocations(): Location[] {
    return this.locationAccounts
      .filter((la) => la.isOwner() && la.location !== null)
      .map((la) => la.location) as Location[]
  }

  adminLocations(): Location[] {
    return this.locationAccounts
      .filter((la) => la.isAdmin() && la.location !== null)
      .map((la) => la.location) as Location[]
  }

  isInBrevard__HACK() {
    return this.locations__HACK().some((l) => l.permalink === 'brevard-academy')
  }

  isMemberOf(location: Location): boolean {
    return this.locationAccounts.filter((la) => la.locationId?.toString() === location.id).length > 0
  }
}
