import { defineMessage } from '@lingui/macro'
import { DateTime } from 'luxon'
import qs from 'qs'

import { getGlobal, setGlobal } from 'reactn'
import { Dict } from 'src/common/types'
import { timeOfDay } from 'src/common/util'

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



export function esExclaim() {
  return getGlobal().locale === 'es' ? '¡' : ''
}

export function greeting() {
  const time = timeOfDay()
  switch (time) {
    case "morning":
      return getGlobal().i18n._(defineMessage({id: "util.good_morning", message: "Good morning"}))
    case "afternoon":
      return getGlobal().i18n._(defineMessage({id: "util.good_afternoon", message: "Good afternoon"}))
    case "evening":
      return getGlobal().i18n._(defineMessage({id: "util.good_evening", message: "Good evening"}))
    default:
      throw new Error(`Unknown time of day ${time}`)
  }
}

/**
 * joinWords(['apple', 'banana', 'mango']) # => 'apple, banana, and mango'
 *
 * @param words
 * @param twoWordsConnector
 * @param lastWordConnector
 * @param wordsConnector
 */
export function joinWords(words: string[], conjunction?: string): string {
  let twoWordsConnector
  let lastWordConnector

  if (conjunction === 'or') {
    twoWordsConnector = getGlobal().i18n._(defineMessage({id: 'util.two_words_or', message: ` or `}))
    lastWordConnector = getGlobal().i18n._(defineMessage({id: 'util.last_word_or', message: `, or `}))
  } else {
    twoWordsConnector = getGlobal().i18n._(defineMessage({id: 'util.two_words_and', message: ` and `}))
    lastWordConnector = getGlobal().i18n._(defineMessage({id: 'util.last_word_and', message: `, and `}))
  }

  const wordsConnector = getGlobal().i18n._(defineMessage({id: 'util.words_connector', message: `, `}))
  if (words.length === 0) {
    return ''
  } else if (words.length === 1) {
    return `${words[0]}`
  } else if (words.length === 2) {
    return `${words[0]}${twoWordsConnector}${words[1]}`
  } else {
    return `${words.slice(0, -1).join(wordsConnector)}${lastWordConnector}${words[words.length - 1]}`
  }
}
