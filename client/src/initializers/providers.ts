import { Router } from 'framework7/modules/router/router'
import { getGlobal, setGlobal, addReducer, addCallback } from 'reactn'
import { deleteSession, getCurrentUser } from 'src/api'
import { User } from 'src/models'
import { i18n, GLLocales } from 'src/i18n'
import CookieJar, { Cookie } from 'src/helpers/CookieJar'
import { LocationCategories } from 'src/models/Location'
import SessionStorage from 'src/helpers/SessionStorage'
import Honeybadger from './honeybadger'
import { paths } from 'src/config/routes'

export function isSignedIn() {
  const user = currentUser()
  return user !== null && user !== undefined
}

export function currentUser(): User | null {
  return getGlobal().currentUser
}

export async function reloadCurrentUser(): Promise<User> {
  const user = await getCurrentUser()
  setGlobal({ currentUser: user })
  return user
}

export async function signOut(router?: Router.Router): Promise<void> {
  await deleteSession()
  Honeybadger.resetContext()
  // TODO: There should be a way of doing this without a hard redirect
  setGlobal({ currentUser: null })
  localStorage.clear()
  if (router) {
    router.navigate(paths.splashPath)
  } else {
    ;(window.location as any) = '/'
  }
}

export function toggleLocale(): void {
  const newLocale = cookieLocale() === 'en' ? 'es' : 'en'
  CookieJar.set(Cookie.LOCALE, newLocale)
  setGlobal({ locale: newLocale })
  i18n.activate(newLocale)
  // TODO: How do we stop doing this?
  // window.location.reload()
}

export function cookieLocale(): GLLocales {
  const locale = CookieJar.get(Cookie.LOCALE) || 'en'
  return locale as GLLocales
}

export class GRegisteringUser {
  firstName: string = ''

  lastName: string = ''

  email: string = ''

  mobileNumber: string = ''

  password: string = ''

  locale: GLLocales = 'en'
}

export class GRegisteringLocation {
  name: string = ''

  zipCode: string = ''

  email: string = ''

  phoneNumber: string = ''

  website: string = ''

  permalink: string = ''

  category: LocationCategories | null = null

  employeeCount: number | null = null

  dailyReminderHour = 8

  dailyReminderAMPM: 'am' | 'pm' = 'am'

  remindMon = true

  remindTue = true

  remindWed = true

  remindThu = true

  remindFri = true

  remindSat = true

  remindSun = true
}

setGlobal({
  locale: cookieLocale(),
  i18n,
  currentUser: null,
  test: null,
  registeringUser: SessionStorage.getRegisteringUser() || new GRegisteringUser(),
  registeringLocation: SessionStorage.getRegisteringLocation() || new GRegisteringLocation(),
})

i18n.activate(cookieLocale())
