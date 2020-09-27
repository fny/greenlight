import { Model, attribute as attr, relationship,initialize, STRING, DATETIME, BOOLEAN } from './Model'
import { User } from './User'
import moment from 'moment'
import colors from '../colors'

export enum GREENLIGHT_STATUSES {
  CLEARED = 'cleared',
  PENDING = 'pending',
  RECOVERING = 'recovering',
  ABSENT = 'absent',
  UNKNOWN = 'unknown'
}

export const GREENLIGHT_COLORS = {
  cleared: { name: 'green', hex:  colors.green },
  pending: { name: 'yellow', hex: colors.yellow },
  recovering: { name: 'pink', hex: colors.pink },
  absent: { name: 'blue', hex: colors.blue },
  unknown: { name: 'gray', hex: colors.gray },
}

export class GreenlightStatus extends Model {
  static STATUSES = GREENLIGHT_STATUSES
  static singular = 'greenlightStatus'
  static plural = 'greenlightStatuses'

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

  @attr({ type: BOOLEAN })
  isOverride: boolean | null = null

  @attr({ type: STRING })
  reason = ''

  @relationship({ type: 'hasOne', model: 'user' })
  user?: User

  colorName() {
    return GREENLIGHT_COLORS[this.status].name
  }

  colorHex() {
    return GREENLIGHT_COLORS[this.status].hex
  }

  isUnknown() {
    return this.status === GREENLIGHT_STATUSES.UNKNOWN
  }

  isAbsent() {
    return this.status === GREENLIGHT_STATUSES.ABSENT
  }

  isCleared() {
    return this.status === GREENLIGHT_STATUSES.CLEARED
  }

  isPending() {
    return this.status === GREENLIGHT_STATUSES.PENDING
  }

  isRecovering() {
    return this.status === GREENLIGHT_STATUSES.RECOVERING
  }
}
