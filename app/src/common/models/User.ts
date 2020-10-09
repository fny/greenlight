import { Model, attribute as attr, relationship, initialize, STRING, DATETIME, DATE } from './Model'
import { DateTime } from 'luxon'
import { Location } from './Location'
import { CUTOFF_TIME, GreenlightStatus } from './GreenlightStatus'
import { MedicalEvent } from './MedicalEvent'
import { LocationAccount } from './LocationAccount'
import { joinWords, today } from '../util'

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
  locale: string | null = null

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
  hasChildren() {
    return this.children.length > 0
  }

  /** Is this user a parent? */
  isParent() {
    return this.hasChildren()
  }

  /** Has the user completed the welcome sequence? */
  hasCompletedWelcome() {
    return this.completedInviteAt !== null && this.completedInviteAt.isValid
  }

  /** The users current greenlight status */
  greenlightStatus(): GreenlightStatus {
    if (!this.lastGreenlightStatus || !this.lastGreenlightStatus.isValidForToday()) {
      return GreenlightStatus.newUnknown()
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
    if (this.hasNotSubmittedOwnSurvey()) {
      return this.greenlightStatus().isCleared()
    }
    return true
  }

  /** This inclues this user */
  areAllUsersCleared(): boolean {
    return this.allUsersNotSubmitted().map(u => u.isCleared()).every(x => x === true)
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
   * who haven't submitted a survey yet.
   */
  allUsersNotSubmitted(): User[] {
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

  allUsersNotSubmittedForTomorrow(): User[] {
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
  allUsersNotSubmittedText(): string {
    return joinWords(this.allUsersNotSubmitted().map(u =>
      u === this ? this.yourself__HACK() : u.firstName
    ))
  }

  /**
   * The names of all the users needing to submit surveys
   */
  allUsersNotSubmittedForTomorrowText(): string {
    return joinWords(this.allUsersNotSubmittedForTomorrow().map(u =>
      u === this ? this.yourself__HACK() : u.firstName
    ))
  }

  showSubmissionPanelForToday(): boolean {
    return this.allUsersNotSubmitted().length > 0 && CUTOFF_TIME.isAfter(DateTime.local())
  }

  showSubmissionPanelForTomorrow(): boolean {
    return this.allUsersNotSubmittedForTomorrow().length > 0 && CUTOFF_TIME.isBefore(DateTime.local())
  }

  yourself__HACK() {
    return this.locale === 'en' ? 'yourself' : 'ti mismo'
  }

  hasLocationThatRequiresSurvey() {
    return this.locationAccounts.length > 0
  }

  needsToSubmitSomeonesSurvey(): boolean {
    return this.allUsersNotSubmitted().length > 0
  }
}
