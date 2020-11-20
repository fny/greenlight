import {
  getGlobal, setGlobal, addReducer,
} from 'reactn'
import { deleteSession, getCurrentUser } from 'src/api'
import { User } from 'src/models'
import { i18n, GLLocales } from 'src/i18n'
import CookieJar, { Cookie } from 'src/misc/CookieJar'
import logger from 'src/logger'
import Honeybadger from './honeybadger'

setGlobal({
  locale: cookieLocale(),
  i18n,
  flashMessage: '',
  // This is used for testing reducers
  x: 0,
})

export function isSignedIn() {
  const user = currentUser()
  return user !== null && user !== undefined
}

export function currentUser(): User | null {
  return getGlobal().currentUser
}

export function currentUserAsserted(router: any) { // TODO: Daniel, can you fix this type?
  const user = getGlobal().currentUser
  if (user) {
    router.navigate('/')
    setGlobal({ flashMessage: 'No current user' })
  }
  return user
}

export async function reloadCurrentUser(): Promise<User> {
  const user = await getCurrentUser()
  setGlobal({ currentUser: user })
  return user
}

export async function signOut() {
  await deleteSession()
  Honeybadger.resetContext();
  // TODO: There should be a way of doing this without a hard redirect
  (window.location as any) = '/'
}

export function toggleLocale() {
  // const newLocale = cookieLocale() === 'en' ? 'es' : 'en'
  // CookieJar.set(Cookie.LOCALE, newLocale)
  // setGlobal({ locale: newLocale })
  // i18n.activate(newLocale)
  // // TODO: How do we stop doing this?
  // window.location.reload()
}

export function cookieLocale(): GLLocales {
  const locale = CookieJar.get(Cookie.LOCALE) || 'en'
  return locale as GLLocales
}

i18n.activate(cookieLocale())

addReducer('increment', (global, dispatch, i = 0) => ({
  x: global.x + i,
}))

// TODO: This doesn't work
// const d = useDispatch('increment')
