import { Model, attribute as attr, Base } from './base'
import { User } from './user'
import moment, { Moment } from 'moment'

export enum GREENLIGHT_STATUSES {
  RED,
  YELLOW,
  GREEN,
  ABSENT,
  UNKNOWN
}

@Model({ singular: 'location', plural: 'locations' })
export class GreenlightStatus extends Base {
  @attr() id: number = -2
  @attr({ type: 'User' }) user: User | null = null
  @attr() status: GREENLIGHT_STATUSES = GREENLIGHT_STATUSES.UNKNOWN

  @attr({ transform: moment })
  statusSetAt: Moment | null = null
  @attr({ transform: moment })
  statusExpiresAt: Moment | null = null
}
