import { parsePhoneNumberFromString } from 'libphonenumber-js'
import qs from 'qs'

import { getGlobal, setGlobal } from 'reactn'
import { ObjectMap } from './common/types'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

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
  console.log(hours)
  if (hours < 12) {
    return 'morning'
  } else if (hours < 17) {
    return 'afternoon'
  } else {
    return 'evening'
  }
}
/**
 * Toggles the current language between English and Spanish
 */
export function toggleLanguage() {
  setGlobal({ language: getGlobal().language === 'en' ? 'es' : 'en'})
}

/**
 * Builds a callable path that will resolve itslev given substitutions.
 * @param path 
 */
export function buildPath(path: string) {
  return (subsitutions?: any, query?: any): string => {
    return resolvePath(path, subsitutions, query)
  }
}

/**
 * Resolves a path template string into a full path.
 *
 * @example
 *   resolvePath('/users/:userId/surveys/:surveyId', [1, 2])
 *   // =>
 *   resolvePath('/users/:userId/surveys/:surveyId', { userId: 1, surveyId: 2})
 *
 * @param path The path template to fill
 * @param subsitutions The array or object from which to fill :placeholders.
 * @param query An optional object to transform into a query string.
 */
export function resolvePath(path: string, subsitutions?: any[] | ObjectMap<any> | null, query?: any ) {
  const re = /:([A-z0-9\-_]+)/g
  const matches = path.match(re)

  const queryString = query ? `?${qs.stringify(query)}` : ''

  if (!matches) {
    // There are no subsitutions to be made
    return `${path}${queryString}`
  }
  
  if (!subsitutions) {
    subsitutions = []
  }

  if (Array.isArray(subsitutions)) {
    if (matches.length !== subsitutions.length) {
      // Not enough substituions were provided
      throw new Error(`Expected ${matches.length} subsitutions, but only got ${subsitutions.length}`)
    }

    for (let i = 0; i < matches.length; i++) {
      path = path.replace(`:${matches[i]}`, String(subsitutions[i]))
    }
  } else {
    const subsitutionsKeys = Object.keys(subsitutions)
    if (matches.length !== subsitutionsKeys.length) {
      // Not enough substituions were provided
      throw new Error(`Expected ${matches.length} subsitutions, but only got ${subsitutionsKeys.length}`)
    }

    for (const match of matches) {
      path = path.replace(`:${match}`, String(subsitutions[match]))
    }
  }

  return `${path}${queryString}`
}
