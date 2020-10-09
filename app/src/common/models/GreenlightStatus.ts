import { Model, attribute as attr, relationship,initialize, STRING, DATETIME, BOOLEAN } from './Model'
import { User } from './User'
import colors from '../colors'
import { today, tomorrow } from '../util'
import CutoffTime from '../misc/CutoffTime'
import { i18n } from '@lingui/core'
import { t } from '@lingui/macro'

import { DateTime }  from 'luxon'

export const CUTOFF_TIME = new CutoffTime('2020-10-08 18:00')

export enum GREENLIGHT_STATUSES {
  CLEARED = 'cleared',
  PENDING = 'pending',
  RECOVERY = 'recovery',
  ABSENT = 'absent',
  UNKNOWN = 'unknown'
}

export const GREENLIGHT_COLORS = {
  cleared: { name: 'green', hex:  colors.green },
  pending: { name: 'yellow', hex: colors.yellow },
  recovery: { name: 'pink', hex: colors.pink },
  absent: { name: 'blue', hex: colors.blue },
  unknown: { name: 'gray', hex: colors.gray },
}

export class GreenlightStatus extends Model {
  static STATUSES = GREENLIGHT_STATUSES
  static singular = 'greenlightStatus'
  static plural = 'greenlightStatuses'

  static newUnknown(): GreenlightStatus {
    return new GreenlightStatus({ status: GreenlightStatus.STATUSES.UNKNOWN })
  }

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING })
  status: GREENLIGHT_STATUSES = GREENLIGHT_STATUSES.UNKNOWN

  @attr({ type: DATETIME })
  submissionDate: DateTime = DateTime.fromISO('')

  @attr({ type: DATETIME })
  expirationDate: DateTime = DateTime.fromISO('')

  @attr({ type: DATETIME })
  followUpDate: DateTime = DateTime.fromISO('')

  @attr({ type: BOOLEAN })
  isOverride = false

  @attr({ type: STRING })
  reason = ''

  @relationship({ type: 'hasOne', model: 'user' })
  user?: User

  /** Name of the color corresponding to the status */
  colorName(): string {
    return GREENLIGHT_COLORS[this.status].name
  }

  /** Hex code of the color corresponding to the status */
  colorHex(): string {
    return GREENLIGHT_COLORS[this.status].hex
  }

  isUnknown(): boolean {
    return this.status === GREENLIGHT_STATUSES.UNKNOWN
  }

  isAbsent(): boolean {
    return this.status === GREENLIGHT_STATUSES.ABSENT
  }

  isCleared(): boolean {
    return this.status === GREENLIGHT_STATUSES.CLEARED
  }

  isPending(): boolean {
    return this.status === GREENLIGHT_STATUSES.PENDING
  }

  isRecovering(): boolean {
    return this.status === GREENLIGHT_STATUSES.RECOVERY
  }

  isValidForDate(date: Moment): boolean {
    return date.isSameOrAfter(this.submissionDate) && date.isSameOrBefore(this.expirationDate) &&  date.isBefore(this.followUpDate)
  }

  isValidForToday(): boolean {
    if (this.isUnknown()) return false
    return this.isValidForDate(today())
  }

  isValidForTomorrow(): boolean {
    if (this.isUnknown()) return false
    return this.isValidForDate(tomorrow())
  }

  title(): string {
    if (this.status === GREENLIGHT_STATUSES.CLEARED) {
      return i18n._(t('GreenlightStatus.cleared')`Cleared`)
    }
    if (this.status === GREENLIGHT_STATUSES.PENDING) {
      return i18n._(t('GreenlightStatus.pending')`Pending`)
    }
    if (this.status === GREENLIGHT_STATUSES.RECOVERY) {
      return i18n._(t('GreenlightStatus.recovery')`Recovery`)
    }
    if (this.status === GREENLIGHT_STATUSES.ABSENT) {
      return i18n._(t('GreenlightStatus.absent')`Absent`)
    }
    return i18n._(t('GreenlightStatus.not_submitted')`Not Submitted`)
  }
}
