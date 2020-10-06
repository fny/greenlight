import { parsePhoneNumberFromString } from 'libphonenumber-js'
import moment from 'moment'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function validEmail(email: string): boolean {
  return EMAIL_REGEX.test(String(email).toLowerCase())
}

export function formatPhone(number: string | null | undefined): string {
  if (!number) return ''
  const parsed = parsePhoneNumberFromString(number, 'US')
  return parsed?.formatNational() || ''
}

export function validPhone(phoneNumber: string): boolean {
  const parsed = parsePhoneNumberFromString(phoneNumber, 'US')
  if (!parsed) {
    return false
  }
  return parsed.country === 'US' && parsed.isValid()
}

export function timeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hours = (new Date()).getHours()
  if (hours < 12) {
    return 'morning'
  } else if (hours < 17) {
    return 'afternoon'
  } else {
    return 'evening'
  }
}

export function greeting() {
  const time = timeOfDay()
  switch (time) {
    case "morning":
      return "Good Morning"
    case "afternoon":
      return "Good Afternoon"
    case "evening":
      return "Good Afternoon"
    default:
      throw new Error(`Unknown time of day ${time}`)
  }
}


export function haveEqualAttrs(a: any, b: any) {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
      return false
  }

  for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i]

      // If values of same property are not equal,
      // objects are not equivalent
      if (a[propName] !== b[propName]) {
          return false
      }
  }

  // If we made it this far, objects
  // are considered equivalent
  return true
}

export function deleteBlanks<T>(obj: T): Partial<T> {
  for (const propName in obj) { 
    // TODO: Bug report
    if ((obj[propName] as any) === '' || obj[propName] === null) {
      delete obj[propName]
    }
  }
  return obj
}

export function isEmptyType(data: any) {
  return typeof data === null ||
  typeof data === undefined
}

export function isPrimitiveType(data: any) {
  return typeof data === 'string' || 
    typeof data === 'number' ||
    typeof data === 'boolean' ||
    typeof data === 'bigint' ||
    typeof data === 'symbol' ||
    typeof data === null ||
    typeof data === undefined
}

export function transformForAPI(data: any): any {
  if (Array.isArray(data)) {
    return data.map(transformForAPI)
  }
  if (isPrimitiveType(data)) {
    return data
  }
  if (moment.isMoment(data)) {
    return data.toISOString()
  }
  const transformed: any = {}
  Object.keys(data).forEach(k => {
    transformed[k] = transformForAPI(data[k])
  })
  return transformed
}

export function conjungtify(words: string[], conjunction: string) {
  const endPos = words.length - 1
  if (endPos === 0) return words[0] // only one word
  return `${words.slice(0, endPos).join(', ')} ${conjunction} ${words[endPos]}`
}
