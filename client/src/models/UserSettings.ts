import {
  Model, attribute as attr, initialize, STRING, BOOLEAN, NUMBER,
} from './Model'

export enum DailyReminderType {
  TEXT = 'text',
  EMAIL = 'email',
  NONE = 'none',
}

export class UserSettings extends Model {
  static modelName = 'userSettings'

  constructor(data?: any) {
    super()
    initialize(this, data)
  }

  @attr({ type: BOOLEAN })
  overrideLocationReminders = false

  @attr({ type: STRING })
  dailyReminderType: DailyReminderType = DailyReminderType.TEXT

  @attr({ type: NUMBER })
  dailyReminderTime = 7

  @attr({ type: BOOLEAN })
  remindMon = false

  @attr({ type: BOOLEAN })
  remindTue = false

  @attr({ type: BOOLEAN })
  remindWed = false

  @attr({ type: BOOLEAN })
  remindThu = false

  @attr({ type: BOOLEAN })
  remindFri = false

  @attr({ type: BOOLEAN })
  remindSat = false

  @attr({ type: BOOLEAN })
  remindSun = false

  dailyReminderHour(): number {
    return this.dailyReminderTime > 12 ? this.dailyReminderTime - 12 : this.dailyReminderTime
  }

  dailyReminderAMPM(): 'am' | 'pm' {
    if (this.dailyReminderTime === 24) return 'am'
    return this.dailyReminderTime < 12 && this.dailyReminderTime !== 12 ? 'am' : 'pm'
  }
}
