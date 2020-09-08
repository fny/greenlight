import { Model, attribute as attr, relationship,initialize, STRING, DATETIME } from './model'
import { User } from './user'
import moment from 'moment'

export enum GREENLIGHT_STATUSES {
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  ABSENT = 'absent',
  UNKNOWN = 'unknown'
}

export class GreenlightStatus extends Model {
  static STATUSES = GREENLIGHT_STATUSES
  static singular = 'greenlight-status'
  static plural = 'greenlight-statuses'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING })
  status: GREENLIGHT_STATUSES = GREENLIGHT_STATUSES.UNKNOWN

  @attr({ type: DATETIME })
  statusSetAt: moment.Moment | null = null

  @attr({ type: DATETIME })
  statusExpiresAt: moment.Moment | null = null

  @attr({ type: STRING })
  reason: string = ''

  @relationship({ type: 'hasOne', model: 'user' })
  user?: User
}
