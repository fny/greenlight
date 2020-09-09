import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { includes } from 'lodash'

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export function validEmail(email: string) {
  return EMAIL_REGEX.test(String(email).toLowerCase())
}

export function validPhoneNumber(phoneNumber: string) {
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
  } else if (hours < 5) {
    return 'afternoon'
  } else {
    return 'evening'
  }
}

type NubmerOrString = number | string

export function url(path: string, values: NubmerOrString[], query: {}) {
  let re = /(:[A-z0-9\-_]+)/g
  const matches = path.match(re)
  
  if (!matches) {
    return path
  }

  if (matches.length !== values.length) {
    throw new Error(`Expected ${matches.length} values, but only got ${values.length}`)
  }

  for (let i = 0; i < matches.length; i++) {
    path = path.replace(matches[i], String(values[i]))
  }
  return path
}
