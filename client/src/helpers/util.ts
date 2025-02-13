import { DateTime } from 'luxon'
import qs from 'qs'

import { getGlobal, setGlobal } from 'reactn'
import { Dict } from 'src/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import logger from 'src/helpers/logger'
import GLPhoneNumber from 'src/helpers/GLPhoneNumber'
import { useCallback } from 'react'
import { tr } from 'src/components/Tr'

//
// Date and Time Related
//

export function yesterday(): DateTime {
  return today().minus({ days: 1 })
}

export function today(): DateTime {
  return DateTime.local().setZone('America/New_York').startOf('day')
}

export function tomorrow(): DateTime {
  return today().plus({ days: 1 })
}

export function timeOfDay(): 'morning' | 'afternoon' | 'evening' {
  const hours = new Date().getHours()
  if (hours < 12) {
    return 'morning'
  }
  if (hours < 17) {
    return 'afternoon'
  }
  return 'evening'
}

export function equalDates(date1: Date | DateTime | null, date2: Date | DateTime | null): boolean {
  if (date1 === null && date2 === null) return true
  if (date1 === null || date2 === null) return false
  const year1 = date1 instanceof Date ? date1.getFullYear() : date1.year
  const month1 = date1 instanceof Date ? date1.getMonth() : date1.month
  const day1 = date1 instanceof Date ? date1.getDate() : date1.day

  const year2 = date2 instanceof Date ? date2.getFullYear() : date2.year
  const month2 = date2 instanceof Date ? date2.getMonth() : date2.month
  const day2 = date2 instanceof Date ? date2.getDate() : date2.day

  return year1 === year2 && month1 === month2 && day1 === day2
}

//
// Assertions, Type Checks, and Predicates
//

export function assertArray<T>(obj: T | T[]): asserts obj is T[] {
  if (!Array.isArray(obj)) {
    throw new Error(`Expected array but received single object ${obj}`)
  }
}

export function assertNotArray<T>(obj: T | T[]): asserts obj is T {
  if (Array.isArray(obj)) {
    throw new Error(`Expected single object but received array ${obj}`)
  }
}

export function assertNotUndefined<T>(obj: T | undefined): asserts obj is T {
  if (obj === undefined) {
    throw new Error(`Expected value but got undefined: ${obj}`)
  }
}

export function assertNotNull<T>(obj: T | null): asserts obj is T {
  if (obj === null) {
    throw new Error(`Expected value but got null: ${obj}`)
  }
}

export function isBlank(value: any): boolean {
  return value === '' || value === 0 || value === undefined || value === null
}

export function isPresent(value: any): boolean {
  return !isBlank(value)
}

export function isEmptyType(data: any): boolean {
  return typeof data === null || typeof data === undefined
}

export function isPrimitiveType(data: any): boolean {
  return (
    typeof data === 'string'
    || typeof data === 'number'
    || typeof data === 'boolean'
    || typeof data === 'bigint'
    || typeof data === 'symbol'
    || data === null
    || data === undefined
  )
}

export function hasKey(obj: any, key: string): boolean {
  return obj[key] !== undefined
}

export function getKeyName<T>(obj: { [i: string]: T }, value: T): string | undefined {
  return Object.keys(obj).find((key) => obj[key] === value)
}

export function isInDurham(zipCode: string): boolean {
  const durhamZipCodes = [
    '27503',
    '27572',
    '27701',
    '27702',
    '27703',
    '27704',
    '27705',
    '27706',
    '27707',
    '27708',
    '27709',
    '27710',
    '27711',
    '27712',
    '27713',
    '27715',
    '27717',
    '27722',
  ]

  return durhamZipCodes.includes(zipCode)
}

export function isInOnslow(zipCode: string): boolean {
  const onslowZipCodes = [
    '28541',
    '28540',
    '28543',
    '28445',
    '28544',
    '28547',
    '28546',
    '28454',
    '28555',
    '28460',
    '28574',
    '28582',
    '28584',
    '28518',
    '28539',
  ]
  return onslowZipCodes.includes(zipCode)
}

/**
 * Resolves a path template string into a full path.
 *
 * @example
 *   resolvePath('/users/:userId/surveys/:surveyId', [1, 2])
 *   // => /users/1/surveys/2
 *   resolvePath('/users/:userId/surveys/:surveyId', { userId: 1, surveyId: 2})
 *   // => /users/1/surveys/2
 *
 * @param path The path template to fill
 * @param substitutions The array or object from which to fill :placeholders.
 * @param query An optional object to transform into a query string.
 */
export function resolvePath(path: string, substitutions?: any[] | Dict<any> | null, query?: any): string {
  const re = /:[A-z0-9\-_]+/g
  const matches = path.match(re)
  const queryString = query ? `?${qs.stringify(query)}` : ''
  if (!matches) {
    // There are no substitutions to be made
    return `${path}${queryString}`
  }

  if (substitutions === undefined || substitutions === null) {
    throw new Error('No substitutions given.')
  }

  if (typeof substitutions === 'string' || typeof substitutions === 'number' || typeof substitutions === 'boolean') {
    substitutions = [substitutions]
  }

  if (Array.isArray(substitutions)) {
    if (matches.length !== substitutions.length) {
      // Not enough substitutions were provided
      throw new Error(`Dynamic path expected ${matches.length} substitutions, but got ${substitutions.length}`)
    }

    for (let i = 0; i < matches.length; i += 1) {
      path = path.replace(`${matches[i]}`, String(substitutions[i]))
    }
  } else {
    const substitutionsKeys = Object.keys(substitutions)
    if (matches.length !== substitutionsKeys.length) {
      // Not enough substitutions were provided
      throw new Error(`Dynamic path expected ${matches.length} substitutions, but got ${substitutionsKeys.length}`)
    }

    for (const match of matches) {
      const subtitutionKey = match.replace(':', '')
      const value = substitutions[subtitutionKey]
      if (value === null || value === undefined) {
        throw new Error(`Missing key ${subtitutionKey} in substitutions: ${JSON.stringify(substitutions)}`)
      }
      path = path.replace(`${match}`, String(substitutions[subtitutionKey]))
    }
  }

  return `${path}${queryString}`
}

//
// Text and I18n Helpers
//

export function esExclaim(): string {
  return getGlobal().locale === 'es' ? '¡' : ''
}

export function greeting(): string {
  const time = timeOfDay()
  switch (time) {
    case 'morning':
      return tr({ en: 'Good morning', es: 'Buenos dias' })
    case 'afternoon':
      return tr({ en: 'Good afternoon', es: 'Buenas tardes' })
    case 'evening':
      return tr({ en: 'Good evening', es: 'Buenas noches' })
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
    twoWordsConnector = tr({ en: ' or ', es: ' o ' })
    lastWordConnector = tr({ en: ', or ', es: ' o ' })
  } else {
    twoWordsConnector = tr({ en: ' and ', es: ' y ' })
    lastWordConnector = tr({ en: ', and ', es: ' y ' })
  }

  const wordsConnector = tr({ en: ', ', es: ', ' })
  if (words.length === 0) {
    return ''
  }
  if (words.length === 1) {
    return `${words[0]}`
  }
  if (words.length === 2) {
    return `${words[0]}${twoWordsConnector}${words[1]}`
  }
  return `${words.slice(0, -1).join(wordsConnector)}${lastWordConnector}${words[words.length - 1]}`
}

//
// Misc
//

/**
 * An interval timer that executes immediately
 *
 * @param func The function to execute
 * @param ms How long to wait between executions
 */
export function setIntervalSafely(func: Function, ms: number, immediate: boolean = false): number {
  if (immediate) func()
  const wrapped = () => {
    func()
    return window.setTimeout(wrapped, ms)
  }
  return wrapped()
}

/**
 * Timeout based loop that checks for a condition and then executes the provided
 * callback once its true.
 *
 * @param conditionFn once this returns true the callback executes
 * @param callback what to do once the condition is met
 * @param freqMs how often to check the condition in milliseconds
 */
export function once(conditionFn: () => boolean, callback: () => void, freqMs: number): void {
  const loop = () => {
    if (conditionFn()) {
      callback()
    } else {
      setTimeout(loop, freqMs)
    }
  }
  loop()
}

/**
 * Pings the given url and waits for a response by checking for a HEAD reponse.
 *
 * @param url URL to ping
 * @param timeout Time to wait for a response in ms
 */
export function ping(url: string, timeout: number): Promise<boolean> {
  return new Promise((resolve) => {
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

export function sortBy<T>(ary: T[], fn: (el: T) => any): T[] {
  return ary
    .map((el) => [fn(el), el] as [any, T])
    .sort((e1, e2) => {
      if (e1[0] > e2[0]) return 1
      if (e1[0] < e2[0]) return -1
      return 0
    })
    .map((x) => x[1])
}

export function zipTwo<X, Y>(xs: X[], ys: Y[]): [X, Y][] {
  const zipped: [X, Y][] = []
  for (let i = 0; i < Math.min(xs.length, ys.length); i += 1) {
    zipped.push([xs[i], ys[i]])
  }
  return zipped
}

export function deleteBlanks<T>(obj: T): Partial<T> {
  for (const propName in obj) {
    if ((obj[propName] as any) === '' || obj[propName] === null) {
      delete obj[propName]
    }
  }
  return obj
}

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
  return new GLPhoneNumber(phoneNumber).isValid()
}

export function haveEqualAttrs(a: any, b: any): boolean {
  // Create arrays of property names
  const aProps = Object.getOwnPropertyNames(a)
  const bProps = Object.getOwnPropertyNames(b)

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false
  }

  for (let i = 0; i < aProps.length; i += 1) {
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

export function transformForAPI(data: any, options: { removeBlanks: boolean } = { removeBlanks: false }): any {
  if (Array.isArray(data)) {
    return data.map((d) => transformForAPI(d, options))
  }
  if (isPrimitiveType(data)) {
    return data
  }
  if (DateTime.isDateTime(data)) {
    return data.toISO()
  }
  const transformed: any = {}
  Object.keys(data).forEach((k) => {
    if (options.removeBlanks && isBlank(data[k])) {
      delete transformed[k]
    } else {
      transformed[k] = transformForAPI(data[k], options)
    }
  })
  return transformed
}

export function debugHandler(callable: CallableFunction, message?: string): (...x: any) => void {
  return (...x) => {
    logger.dev('[Called]', callable, message)
    callable(...x)
  }
}

export function upperCaseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function lowerCaseFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1)
}

export function stringify(
  val: any,
  depth: number,
  replacer?: null | ((this: any, key: string, value: any) => any),
  space?: string | number,
  onGetObjID?: (val: object) => string,
): string {
  depth = isNaN(+depth) ? 1 : depth
  const recursMap = new WeakMap()
  function _build(val: any, depth: number, o?: any, a?: boolean, r?: boolean) {
    return !val || typeof val !== 'object'
      ? val
      : ((r = recursMap.has(val)),
      recursMap.set(val, true),
      (a = Array.isArray(val)),
      r
        ? (o = (onGetObjID && onGetObjID(val)) || null)
        : JSON.stringify(val, (k, v) => {
          if (a || depth > 0) {
            if (replacer) v = replacer(k, v)
            if (!k) return (a = Array.isArray(v)), (val = v)
            !o && (o = a ? [] : {})
            o[k] = _build(v, a ? depth : depth - 1)
          }
        }),
      o === void 0 ? (a ? [] : {}) : o)
  }
  return JSON.stringify(_build(val, depth), null, space)
}

export function titleCase(x: string): string {
  let i
  let j
  let str = x.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  const lowers = [
    'A',
    'An',
    'The',
    'And',
    'But',
    'Or',
    'For',
    'Nor',
    'As',
    'At',
    'By',
    'For',
    'From',
    'In',
    'Into',
    'Near',
    'Of',
    'On',
    'Onto',
    'To',
    'With',
  ]
  for (i = 0, j = lowers.length; i < j; i += 1) {
    str = str.replace(new RegExp(`\\s${lowers[i]}\\s`, 'g'), (txt) => txt.toLowerCase())
  }

  // Certain words such as initialisms or acronyms should be left uppercase
  const uppers = ['Id', 'Tv']
  for (i = 0, j = uppers.length; i < j; i += 1) {
    str = str.replace(new RegExp(`\\b${uppers[i]}\\b`, 'g'), uppers[i].toUpperCase())
  }

  return str
}

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number): (...args: Parameters<F>) => ReturnType<F> {
  let timeout: ReturnType<typeof setTimeout> | null = null

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => func(...args), waitFor)
  }

  return debounced as (...args: Parameters<F>) => ReturnType<F>
}

function useDebounce(callback: any, delay: number) {
  const debouncedFn = useCallback(
    debounce((...args) => callback(...args), delay),
    [delay], // will recreate if delay changes
  )
  return debouncedFn
}

export function isInViewport(element: Element): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0
    && rect.left >= 0
    && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    && rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

export function countVisible(selector: string): number {
  return Array.from(document.querySelectorAll(selector))
    .map(isInViewport)
    .reduce((acc, curr: boolean) => acc + (curr ? 1 : 0), 0)
}

export function forceReRender() {
  setGlobal((globalState) => ({
    ...globalState,
    toggleForceUpdate: !globalState.toggleForceUpdate,
  }))
}

export function copyTextToClipboard(text: string): void {
  const textArea = document.createElement('textarea')

  //
  // *** This styling is an extra step which is likely not required. ***
  //
  // Why is it here? To ensure:
  // 1. the element is able to have focus and selection.
  // 2. if the element was to flash render it has minimal visual impact.
  // 3. less flakyness with selection and copying which **might** occur if
  //    the textarea element is not visible.
  //
  // The likelihood is the element won't even render, not even a
  // flash, so some of these are just precautions. However in
  // Internet Explorer the element is visible whilst the popup
  // box asking the user for permission for the web page to
  // copy to the clipboard.
  //

  // Place in the top-left corner of screen regardless of scroll position.
  textArea.style.position = 'fixed'
  textArea.style.top = '0'
  textArea.style.left = '0'

  // Ensure it has a small width and height. Setting to 1px / 1em
  // doesn't work as this gives a negative w/h on some browsers.
  textArea.style.width = '2em'
  textArea.style.height = '2em'

  // We don't need padding, reducing the size if it does flash render.
  textArea.style.padding = '0'

  // Clean up any borders.
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'

  // Avoid flash of the white box if rendered for any reason.
  textArea.style.background = 'transparent'

  textArea.value = text

  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    const msg = successful ? 'successful' : 'unsuccessful'
    console.log(`Copying text command was ${msg}`)
  } catch (err) {
    console.log('Oops, unable to copy')
  }

  document.body.removeChild(textArea)
}
