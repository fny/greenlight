import colors from 'src/config/colors'
import { today, tomorrow } from 'src/helpers/util'
import CutoffTime from 'src/helpers/CutoffTime'

import { DateTime } from 'luxon'
import {
  Model, attribute as attr, initialize, STRING, DATETIME, BOOLEAN, hasOne,
} from 'src/lib/Model'
import { User } from './User'
import { tr } from 'src/components/Tr'

export const CUTOFF_TIME = new CutoffTime('2020-10-08 18:00')

export enum GreenlightStatusTypes {
  CLEARED = 'cleared',
  PENDING = 'pending',
  RECOVERY = 'recovery',
  ABSENT = 'absent',
  UNKNOWN = 'unknown',
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
  cleared: { name: 'green', hex: colors.green },
  pending: { name: 'yellow', hex: colors.yellow },
  recovery: { name: 'pink', hex: colors.pink },
  absent: { name: 'blue', hex: colors.blue },
  unknown: { name: 'gray', hex: colors.gray },
}

export class GreenlightStatus extends Model {
  static modelName = 'greenlightStatus'

  static newUnknown(): GreenlightStatus {
    return new GreenlightStatus({ status: GreenlightStatusTypes.UNKNOWN })
  }

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: STRING })
  status: GreenlightStatusTypes = GreenlightStatusTypes.UNKNOWN

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

  @hasOne('User')
  user: User | null = null

  /** Name of the color corresponding to the status */
  colorName(): string {
    return GREENLIGHT_COLORS[this.status].name
  }

  /** Hex code of the color corresponding to the status */
  colorHex(): string {
    return GREENLIGHT_COLORS[this.status].hex
  }

  isUnknown(): boolean {
    return this.status === GreenlightStatusTypes.UNKNOWN
  }

  isAbsent(): boolean {
    return this.status === GreenlightStatusTypes.ABSENT
  }

  isCleared(): boolean {
    return this.status === GreenlightStatusTypes.CLEARED
  }

  isPending(): boolean {
    return this.status === GreenlightStatusTypes.PENDING
  }

  isRecovering(): boolean {
    return this.status === GreenlightStatusTypes.RECOVERY
  }

  isValidForDate(date: DateTime): boolean {
    return date >= this.submissionDate && date <= this.expirationDate && date < this.followUpDate
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
    if (this.status === GreenlightStatusTypes.CLEARED) {
      return tr({ en: 'Cleared', es: 'Aprobado' })
    }
    if (this.status === GreenlightStatusTypes.PENDING) {
      return tr({ en: 'Pending', es: 'Pendiente' })
    }
    if (this.status === GreenlightStatusTypes.RECOVERY) {
      return tr({ en: 'Recovery', es: 'Recuperación' })
    }
    if (this.status === GreenlightStatusTypes.ABSENT) {
      return tr({ en: 'Absent', es: '' })
    }
    return tr({ en: '', es: '' })
  }
}
