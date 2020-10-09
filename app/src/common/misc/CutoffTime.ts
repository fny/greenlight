import { DateTime } from 'luxon'

/**  Types that can be converted to DateTime */
type DateTimeable = string | number | Date | DateTime

function secondsSinceMidnight(time: DateTime) {
  return time.diff(time.startOf('day')).seconds
}

function toDateTime(dt: DateTimeable): DateTime {
  if (dt instanceof DateTime) return dt
  if (dt instanceof Date)     return DateTime.fromJSDate(dt)
  if (typeof dt === 'number') return DateTime.fromMillis(dt)

  if (typeof dt === 'string') {
    const conversions = [DateTime.fromISO, DateTime.fromRFC2822, DateTime.fromSQL, DateTime.fromHTTP]
    for (const conversion of conversions) {
      const attempt = conversion(dt)
      if (attempt.isValid) return attempt
    }
  }
  throw `Can't convet ${dt} into DateTime`
}

export default class CutoffTime {
  cutoff: DateTime
  secondsSinceMidnight: number
  constructor(cutoff: DateTimeable) {
    this.cutoff = toDateTime(cutoff)
    if (!this.cutoff.isValid) {
      throw "Invalid date provided for cutoff"
    }
    this.secondsSinceMidnight = secondsSinceMidnight(this.cutoff)
  }

  compare(other: DateTimeable): 1 | -1 | 0 {
    const otherM = toDateTime(other)
    const otherSeconds = secondsSinceMidnight(otherM)

    if (this.secondsSinceMidnight > otherSeconds) {
      return 1
    }

    if (this.secondsSinceMidnight < otherSeconds) {
      return -1
    }

    return 0
  }

  isBefore(other: DateTimeable): boolean {
    return this.compare(other) === -1
  }

  isAfter(other: DateTimeable): boolean {
    return this.compare(other) === 1
  }

  isSame(other: DateTimeable): boolean {
    return this.compare(other) === 0
  }

  isSameOrBefore(other: DateTimeable): boolean {
    return this.isSame(other) || this.isBefore(other)
  }

  isSameOrAfter(other: DateTimeable): boolean {
    return this.isSame(other) || this.isAfter(other)
  }
}
