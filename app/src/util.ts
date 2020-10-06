import qs from 'qs'

import React, { getGlobal, setGlobal } from 'reactn'
import { Dict } from './common/types'

/**
 * Toggles the current language between English and Spanish
 */
export function toggleLanguage() {
  setGlobal({ language: getGlobal().language === 'en' ? 'es' : 'en'})
}

type DynamicPath = (substitutions?: any, query?: any) => string

/**
 * Builds a callable path that will resolve itslev given substitutions.
 * @param path 
 */
export function buildDynamicPath(path: string): DynamicPath {
  return (substitutions?: any, query?: any): string => {
    return resolvePath(path, substitutions, query)
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
 * @param substitutions The array or object from which to fill :placeholders.
 * @param query An optional object to transform into a query string.
 */
export function resolvePath(path: string, substitutions?: any[] | Dict<any> | null, query?: any ) {
  const re = /:[A-z0-9\-_]+/g
  const matches = path.match(re)
  const queryString = query ? `?${qs.stringify(query)}` : ''

  if (!matches) {
    // There are no substitutions to be made
    return `${path}${queryString}`
  }
  
  if (substitutions === undefined || substitutions === null) {
    throw new Error("No substitutions given.")
  }

  if (typeof substitutions === 'string' || typeof substitutions === 'number' || typeof substitutions === 'boolean') {
    substitutions = [substitutions]
  }

  if (Array.isArray(substitutions)) {
    if (matches.length !== substitutions.length) {
      // Not enough substituions were provided
      throw new Error(`Expected ${matches.length} substitutions, but only got ${substitutions.length}`)
    }

    for (let i = 0; i < matches.length; i++) {
      path = path.replace(`${matches[i]}`, String(substitutions[i]))
    }
  } else {
    const substitutionsKeys = Object.keys(substitutions)
    if (matches.length !== substitutionsKeys.length) {
      // Not enough substituions were provided
      throw new Error(`Expected ${matches.length} substitutions, but only got ${substitutionsKeys.length}`)
    }

    for (const match of matches) {
      const subtitutionKey = match.replace(':', '')
      if (!substitutions[subtitutionKey]) {
        throw new Error(`Missing key ${subtitutionKey} in substitutions: ${JSON.stringify(substitutions)}`)
      }
      path = path.replace(`${match}`, String(substitutions[subtitutionKey]))
    }
  }

  return `${path}${queryString}`
}

