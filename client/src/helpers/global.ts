import { Router } from 'framework7/modules/router/router'
import { getGlobal, setGlobal } from 'reactn'
import { deleteSession, getCurrentUser, updateUser } from 'src/api'
import { User } from 'src/models'
import { i18n, GLLocales } from 'src/i18n'
import CookieJar, { Cookie } from 'src/helpers/CookieJar'

import { paths } from 'src/config/routes'
import Honeybadger from 'src/initializers/honeybadger'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { RegisteringUser } from 'src/models/RegisteringUser'
import SessionStorage from './SessionStorage'

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
  if (router) {
    router.navigate(paths.splashPath)
  } else {
    (window.location as any) = '/'
  }
  await deleteSession()
  Honeybadger.resetContext()
  // TODO: There should be a way of doing this without a hard redirect
  setGlobal({ currentUser: null })
  localStorage.clear()

}

export function toggleLocale(): void {
  const newLocale = cookieLocale() === 'en' ? 'es' : 'en'
  CookieJar.set(Cookie.LOCALE, newLocale)
  setGlobal({ locale: newLocale })
  i18n.activate(newLocale)
  const { currentUser } = getGlobal()
  if (currentUser) {
    updateUser(currentUser, { locale: newLocale })
  }
}

export function cookieLocale(): GLLocales {
  const locale = CookieJar.get(Cookie.LOCALE) || 'en'
  return locale as GLLocales
}

export function resetRegistration(): void {
  SessionStorage.deleteRegisteringLocation()
  SessionStorage.deleteRegisteringUser()
  setGlobal({
    registeringLocation: new RegisteringLocation(),
    registeringUser: new RegisteringUser(),
  })
}
