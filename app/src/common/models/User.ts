import { Model, attribute as attr, relationship, initialize, STRING, DATETIME, DATE } from './Model'
import { DateTime } from 'luxon'
import { Location } from './Location'
import { CUTOFF_TIME, GreenlightStatus } from './GreenlightStatus'
import { MedicalEvent } from './MedicalEvent'
import { LocationAccount } from './LocationAccount'

// TODO: These are app specific and need to be moved out
import { joinWords } from 'src/util'

export class User extends Model {
  static singular = 'user'
  static plural = 'users'

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

  @attr({ type: STRING })
  locale: 'en' | 'es' | null = null

  @attr({ type: STRING })
  dailyReminderType: string | null = null

  @attr({ type: DATE })
  birthDate: string | null = null

  @attr({ type: DATETIME })
  acceptedTermsAt: DateTime = DateTime.fromISO('')

  @attr({ type: DATETIME })
  completedInviteAt: DateTime = DateTime.fromISO('')

  @relationship({ type: 'hasMany', model: 'locationAccount'})
  locationAccounts: LocationAccount[] = []

  @relationship({ type: 'hasMany', model: 'user' })
  children: User[] = []

  @relationship({ type: 'hasMany', model: 'user' })
  parents: User[] = []

  @relationship({ type: 'hasMany', model: 'medicalEvent' })
  medicalEvents: MedicalEvent[] = []

  @relationship({ type: 'hasMany', model: 'medicalEvent' })
  recentMedicalEvents: MedicalEvent[] = []

  @relationship({ type: 'hasOne', model: 'greenlightStatus' })
  lastGreenlightStatus: GreenlightStatus | null = null

  reversedName() {
    return `${this.lastName}, ${this.firstName}`
  }

  sortedChildren() {
    return this.children.sort((a, b) => (a.id < b.id) ? 1 : -1)
  }

  locations__HACK() {
    return this.locationAccounts.map(la => la.location).filter(l => l !== null || l !== undefined)
  }

  /** The users first name. */
  fullName() {
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

  // HACK
  isAdmin(): boolean {
    return ['faraz.yashar@gmail.com',
    'josephbwebb@gmail.com',
    'mark.sendak@duke.edu',
    'april.warren@studentudurham.org',
    'amy.salo@studentudurham.org',
    'cameron.phillips@studentudurham.org',
    'daniela.sanchez@studentudurham.org',
    'ray.starn@studentudurham.org',
    'kellane.kornegay@studentudurham.org',
    'feyth.scott@studentudurham.org',
    'madelyn.srochi@studentudurham.org',
    'bryanna.ray@studentudurham.org',
    'emmanuel.lee@studentudurham.org'].includes(this.email || '')
  }

  // HACK
  adminLocation__HACK() {
    return this.locationAccounts[0]?.locationId
  }

  /** Has the user completed the welcome sequence? */
  hasCompletedWelcome() {
    return this.completedInviteAt !== null && this.completedInviteAt.isValid
  }

  /** The users current greenlight status */
  greenlightStatus(): GreenlightStatus {
    if (!this.lastGreenlightStatus || !this.lastGreenlightStatus.isValidForToday()) {
      const status = GreenlightStatus.newUnknown()
      status.user = this
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
    return this.usersExpectedToSubmit().map(u => u.isCleared()).every(x => x === true)
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
   * The names of all the users needing to submit surveys
   */
  usersNotSubmittedText(): string {
    return joinWords(this.usersNotSubmitted().map(u =>
      u === this ? this.yourself__HACK() : u.firstName
    ))
  }

  /**
   * The names of all the users needing to submit surveys
   */
  usersNotSubmittedForTomorrowText(): string {
    return joinWords(this.usersNotSubmittedForTomorrow().map(u =>
      u === this ? this.yourself__HACK() : u.firstName
    ))
  }

  showSubmissionPanelForToday(): boolean {
    return this.usersNotSubmitted().length > 0 && CUTOFF_TIME.isAfter(DateTime.local())
  }

  showSubmissionPanelForTomorrow(): boolean {
    return this.usersNotSubmittedForTomorrow().length > 0 && CUTOFF_TIME.isBefore(DateTime.local())
  }

  yourself__HACK() {
    return this.locale === 'en' ? 'yourself' : 'ti mismo'
  }

  you__HACK() {
    return this.locale === 'en' ? 'you' : 'tu'
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
}