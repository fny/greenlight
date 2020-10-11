import { defineMessage } from '@lingui/macro'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import { DateTime } from 'luxon'

import { getGlobal } from 'reactn'

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
  if (DateTime.isDateTime(data)) {
    return data.toISO()
  }
  const transformed: any = {}
  Object.keys(data).forEach(k => {
    transformed[k] = transformForAPI(data[k])
  })
  return transformed
}

export function joinWords(words: string[], twoWordsConnector?: string, lastWordConnector?: string, wordsConnector?: string): string {
  const twoWordsConnector_ = twoWordsConnector || getGlobal().i18n._(defineMessage({id: 'util.two_words_connector', message: ` and `}))
  const lastWordConnector_ = lastWordConnector || getGlobal().i18n._(defineMessage({id: 'util.last_word_connector', message: `, and `}))
  const wordsConnector_ = wordsConnector || getGlobal().i18n._(defineMessage({id: 'util.words_connector', message: `, `}))

  if (words.length === 0) {
    return ''
  } else if (words.length === 1) {
    return `${words[0]}`
  } else if (words.length === 2) {
    return `${words[0]}${twoWordsConnector_}${words[1]}`
  } else {
    return `${words.slice(0, -1).join(wordsConnector_)}${lastWordConnector_}${words[words.length - 1]}`
  }
}

export function yesterday(): DateTime {
  return today().minus({ days: 1 })
}

export function today(): DateTime {
  return DateTime.local().setZone('America/New_York').startOf('day')
}

export function tomorrow(): DateTime {
  return today().plus({ days: 1 })
}


/**
 * Pings the given url and waits for a response by checking for a HEAD reponse.
 *
 * @param url URL to ping
 * @param timeout Time to wait for a response in ms
 */
export function ping(url: string, timeout: number): Promise<boolean> {
  return new Promise(resolve => {
    const isOnline = () => resolve(true)
    const isOffline = () => resolve(false)

    const xhr = new XMLHttpRequest()

    xhr.onerror = isOffline
    xhr.ontimeout = isOffline
    xhr.onreadystatechange = () => {
      if (xhr.readyState === xhr.HEADERS_RECEIVED) {
        if (xhr.status) {
          isOnline()
        } else {
          isOffline()
        }
      }
    }

    xhr.open('HEAD', url)
    xhr.timeout = timeout
    xhr.send()
  })
}

/**
 * HACK: This is a hack to force the TypeScript compiler to recognize that a single
 * object is expected from a union type.
 *
 * @param obj
 */
export function assertNotArray<T>(obj: T | T[]): asserts obj is T {
  if (Array.isArray(obj)) {
    throw new Error(`Expected single object but received array ${obj}`)
  }
}

export function sortBy<T>(ary: T[], fn: (el: T) => any): T[] {
  return ary.map(el => [fn(el), el] as [any, T]).sort((e1, e2) => {
    if (e1[0] > e2[0]) return 1
    if (e1[0] < e2[0]) return -1
    return 0
  }).map(x => x[1])
}

/**
 * HACK: This is a hack to force the TypeScript compiler to recognize that a single
 * object is expected from a union type.
 *
 * @param obj
 */
export function assertNotUndefined<T>(obj: T | undefined): asserts obj is T {
  if (obj === undefined) {
    throw new Error(`Expected value but got undefined ${obj}`)
  }
}

export function assertNotNull<T>(obj: T | null): asserts obj is T {
  if (obj === null) {
    throw new Error(`Expected value but got undefined ${obj}`)
  }
}

export function zipTwo<X, Y>(xs: X[], ys: Y[]): [X , Y][] {
  const zipped: [X, Y][] = []
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]])
  }
  return zipped
}
