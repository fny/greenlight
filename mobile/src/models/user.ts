import { Model, attribute as attr, Base } from './base'
import moment, { Moment } from 'moment'
import { Location } from './location'
import { GreenlightStatus } from './greenlightStatus'

@Model({ singular: 'user', plural: 'users' })
export class UserX extends Base {
  @attr() id: number = -2
  @attr() firstName: string = ''
  @attr() lastName: string = ''
  @attr() email: string | null = null
  @attr() emailConfirmedAt: string | null = null
  @attr() mobileNumber: string | null = null
  @attr() mobileCarrier: string | null = null
  @attr() mobileNumberUnconfirmed: string | null = null
  @attr() zipCode: string | null = null
  @attr() physicianName: string | null = null
  @attr() physicianPhone: string | null = null
  @attr({ transform: moment })
  reviewedAt: Moment | null = null

  @attr({ type: 'User' })
  reviewedBy: Moment | null = null

  @attr({ type: [Location] })
  locations: Location[] = []

  @attr({ type: ['User'] })
  children: User[] = []

  @attr({ type: [GreenlightStatus] })
  greenlightStatuses: GreenlightStatus[] = []
}

export interface User {
    id: number
    firstName: string
    lastName: string
    email?: string
    mobileNumber?: string
    children: User[]
    parents: User[]
    locations: Location[]
}
