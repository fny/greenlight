import { Model, attribute as attr, relationship, initialize, STRING, DATETIME } from './model'
import moment, { Moment } from 'moment'
import { Location } from './location'
import { GreenlightStatus } from './greenlightStatus'
import { MedicalEvent, findLastEvent, hasEvent } from './medicalEvent'

export class User extends Model {
  static singular = 'user'
  static plural = 'users'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING })
  firstName: string = ''

  @attr({ type: STRING })
  lastName: string = ''

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
  physicianPhone: string | null = null

  @attr({ type: DATETIME })
  reviewedAt: moment.Moment | null = null

  @relationship({ type: 'hasOne', model: 'user' })
  reviewedBy?: User

  @relationship({ type: 'hasMany', model: 'location' })
  locations: Location[] = []

  @relationship({ type: 'hasMany', model: 'user' })
  children: User[] = []

  @relationship({ type: 'hasMany', model: 'user' })
  parents: User[] = []

  @relationship({ type: 'hasMany', model: 'medical-event' })
  medicalEvents: MedicalEvent[] = []

  @relationship({ type: 'hasMany', model: 'greenlight-status' })
  greenlightStatuses: GreenlightStatus[] = []


  hasChildren() {
    return this.children.length > 0
  }

  isParent() {
    return this.hasChildren()
  }

  greenlightStatus() {
    if (this.greenlightStatuses.length === 0) {
      return new GreenlightStatus({ status: GreenlightStatus.STATUSES.UNKNOWN })
    }
    return this.greenlightStatuses[-1]
  }
}

//  - If nothing in survey is checked, proceed to school
//  - If exposure only, stay home for 14 days
//  - If diagnosed asymptomatic home for 10 days
//  - If one symptom,
//   - If positive or not tested:
//     - 10 days since first symptoms
//     - No fever for 24 hours (without fever reducing techniques)
//     - Symptom improviment
//   - Negative test
//     - No fever for 24 hours
//   - Confirmed alternative diagnosis

// class NCGreenlightStrategy {
//   user: User
//   constructor(user: User) {
//     this.user = user
//   }

//   status() {
//     const lastExposure = findLastEvent(this.user.medicalEvents, MedicalEvent.TYPES.COVID_EXPOSURE, 14)

//     const lastCOVIDPositive = findLastEvent(this.user.medicalEvents, [
//       MedicalEvent.TYPES.COVID_DIAGNOSIS, MedicalEvent.TYPES.COVID_TEST_POSITIVE
//     ], 10)

//     const lastCOVIDNegative = findLastEvent(this.user.medicalEvents, [
//       MedicalEvent.TYPES.COVID_RULED_OUT, MedicalEvent.TYPES.COVID_TEST_NEGATIVE
//     ], 10)
//     const hasAnySymptoms = hasEvent(this.user.medicalEvents, MedicalEvent.SYMPTOMS, 1)
//     const hasRecentFever = hasEvent(this.user.medicalEvents, MedicalEvent.TYPES.FEVER, 1)
//     const hasSymptomImprovement = hasEvent(this.user.medicalEvents, MedicalEvent.TYPES.SYMPTOM_IMPROVEMENT, 1)

//     if (!hasAnySymptoms && lastExposure === null && lastCOVIDPositive === null) {
//       const now = moment()
//       return new GreenlightStatus({
//         statusSetAt: now
//         statusExpiresAt: now.add(1, 'day')
//       })
//     }

//     hasEvent(this.user.medicalEvents, MedicalEvent.TYPES.COVID_TEST_POSITIVE, 14)
//   }


// }
