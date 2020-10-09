import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'
import { DateTime } from 'luxon'
import { Dict } from '../types'
import env from 'src/common/env'

const SESSION_COOKIE_NAME = '_gl_sess_beta'

interface SessionInterface {
  isValid(): boolean
  issuedAt(): DateTime
  expiresAt(): DateTime
  isExpired(): boolean
  headers(): Dict<string>
  removeCookie(): void
  userId(): number | null
}

interface SessionJWT {
  iat: number
  exp: number
  auth_token: string
  user_id: number
}

export class NullSession implements SessionInterface {
  token = { token: '' }
  userId() {
    return null
  }
  isValid() {
    return false
  }
  issuedAt() {
    return DateTime.local()
  }
  expiresAt() {
    return DateTime.local()
  }
  isExpired() {
    return true
  }
  headers() {
    return {}
  }
  removeCookie() {
    return undefined
  }
}

export class Session implements SessionInterface {
  token: string
  data: SessionJWT

  static init() {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME)
    if (sessionCookie) {
      const token = new Session(sessionCookie)
      if (!token.isExpired()) {
        return token
      }
    }
    return new NullSession()
  }

  constructor(token: string) {
    this.token = token
    this.data = jwt_decode(token) as SessionJWT
  }

  isValid() {
    return !this.isExpired()
  }

  issuedAt() {
    return DateTime.fromSeconds(this.data.iat)
  }

  expiresAt() {
    return DateTime.fromSeconds(this.data.exp)
  }

  isExpired() {
    return this.expiresAt() < DateTime.local()
  }

  userId() {
    return this.data.user_id
  }

  saveCookie(expiration?: number) {
    if (expiration) {
      Cookies.set(SESSION_COOKIE_NAME, this.token, {
        expires: expiration,
        secure: env.isProduction()
      })
    } else {

      Cookies.set(SESSION_COOKIE_NAME, this.token)
    }
  }

  removeCookie() {

    Cookies.remove(SESSION_COOKIE_NAME)
  }

  headers(): Dict<string> {
    return { 'Authorization': `Bearer ${this.token}`}
  }
}
