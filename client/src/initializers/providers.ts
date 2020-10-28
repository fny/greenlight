import { setGlobal, getGlobal } from 'reactn'
import { deleteSession, getCurrentUser } from 'src/api'
import { User } from 'src/models'
import { cookieLocale, myI18n } from 'src/i18n'
import Honeybadger from './honeybadger'

setGlobal({
  locale: cookieLocale(),
  i18n: myI18n
})

export function isSignedIn() {
  const user = currentUser()
  return user !== null && user !== undefined
}

export function currentUser() {
  return getGlobal().currentUser
}

export async function reloadCurrentUser(): Promise<User> {
  const user = await getCurrentUser()
  setGlobal({ currentUser: user })
  return user
}

export async function signOut() {
  await deleteSession()
  Honeybadger.resetContext()
  setGlobal({ currentUser: null})
  ;(window.location as any) = '/'
}
