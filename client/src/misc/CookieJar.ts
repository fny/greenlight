import Cookies from 'js-cookie'

const COOKIE_KEYS = '_gl_last_ver'

export enum Cookie {
  LAST_VERSION = '_gl_last_version_seen',
  LOCALE = '_gl_locale',
  ERROR_MESSAGE = '_gl_error_message',
}

const CookieJar = {
  get(name: Cookie): string | undefined {
    return Cookies.get(name)
  },

  set(name: Cookie, value: string) {
    Cookies.set(name, value)
    return value
  },

  delete(name: Cookie): void {
    Cookies.remove(name)
  },
}

export default CookieJar
