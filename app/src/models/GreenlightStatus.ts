import { Model, attribute as attr, relationship,initialize, STRING, DATETIME, BOOLEAN } from './Model'
import { User } from './User'
import colors from 'src/misc/colors'
import { today, tomorrow } from 'src/util'
import CutoffTime from 'src/misc/CutoffTime'
import { defineMessage } from '@lingui/macro'

import { DateTime }  from 'luxon'
import { getGlobal } from 'reactn'

export const CUTOFF_TIME = new CutoffTime('2020-10-08 18:00')

export enum GREENLIGHT_STATUSES {
  CLEARED = 'cleared',
  PENDING = 'pending',
  RECOVERY = 'recovery',
  ABSENT = 'absent',
  UNKNOWN = 'unknown'
}

export type REASONS = 'cleared'
  | 'cleared_alternative_diagnosis'
  | 'cleared_with_symptom_improvement'
  | 'pending_needs_diagnosis'
  | 'recovery_covid_exposure'
  | 'recovery_asymptomatic_covid_exposure'
  | 'recovery_from_diagnosis'
  | 'recovery_not_covid_has_fever'
  | 'recovery_diagnosed_asymptomatic'
  | 'recovery_return_tomorrow'


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

  isValidForDate(date: DateTime): boolean {
    return date >= this.submissionDate && date <= this.expirationDate &&  date < this.followUpDate
  }

  isValidForToday(): boolean {
    if (this.isUnknown()) return false
    return this.isValidForDate(today())
  }

  isValidForTomorrow(): boolean {
    if (this.isUnknown()) return false
    return this.isValidForDate(tomorrow())
  }

  // TODO: Move out
  title(): string {
    if (this.status === GREENLIGHT_STATUSES.CLEARED) {
      return getGlobal().i18n._(defineMessage({ id: 'GreenlightStatus.cleared', message: "Cleared"}))
    }
    if (this.status === GREENLIGHT_STATUSES.PENDING) {
      return getGlobal().i18n._(defineMessage({ id: 'GreenlightStatus.pending', message: "Pending"}))
    }
    if (this.status === GREENLIGHT_STATUSES.RECOVERY) {
      return getGlobal().i18n._(defineMessage({ id: 'GreenlightStatus.recovery', message: "Recovery"}))
    }
    if (this.status === GREENLIGHT_STATUSES.ABSENT) {
      return getGlobal().i18n._(defineMessage({ id: 'GreenlightStatus.absent', message: "Absent"}))
    }
    return getGlobal().i18n._(defineMessage({ id: 'GreenlightStatus.not_submitted', message: "Not Submitted"}))
  }
}

