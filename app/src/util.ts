import qs from 'qs'

import { getGlobal, setGlobal } from 'reactn'
import { Dict } from './common/types'

/**
 * Toggles the current language between English and Spanish
 */
export function toggleLanguage() {
  setGlobal({ language: getGlobal().language === 'en' ? 'es' : 'en'})
}

type DynamicPath = (subsitutions?: any, query?: any) => string

/**
 * Builds a callable path that will resolve itslev given substitutions.
 * @param path 
 */
export function buildDynamicPath(path: string) {
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
export function resolvePath(path: string, subsitutions?: any[] | Dict<any> | null, query?: any ) {
  const re = /:[A-z0-9\-_]+/g
  const matches = path.match(re)
  const queryString = query ? `?${qs.stringify(query)}` : ''

  if (!matches) {
    // There are no subsitutions to be made
    return `${path}${queryString}`
  }
  
  if (!subsitutions) {
    subsitutions = []
  }

  if (subsitutions === undefined || subsitutions === null) {
    throw new Error("No substitutions given.")
  }

  if (typeof subsitutions === 'string' || typeof subsitutions === 'number' || typeof subsitutions === 'boolean') {
    subsitutions = [subsitutions]
  }

  if (Array.isArray(subsitutions)) {
    if (matches.length !== subsitutions.length) {
      // Not enough substituions were provided
      throw new Error(`Expected ${matches.length} subsitutions, but only got ${subsitutions.length}`)
    }

    for (let i = 0; i < matches.length; i++) {
      path = path.replace(`${matches[i]}`, String(subsitutions[i]))
    }
  } else {
    const subsitutionsKeys = Object.keys(subsitutions)
    if (matches.length !== subsitutionsKeys.length) {
      // Not enough substituions were provided
      throw new Error(`Expected ${matches.length} subsitutions, but only got ${subsitutionsKeys.length}`)
    }

    for (const match of matches) {
      const subtitutionKey = match.replace(':', '')
      if (!subsitutions[subtitutionKey]) {
        throw new Error(`Missing key ${subtitutionKey} in substitutions: ${JSON.stringify(subsitutions)}`)
      }
      path = path.replace(`${match}`, String(subsitutions[subtitutionKey]))
    }
  }

  return `${path}${queryString}`
}
