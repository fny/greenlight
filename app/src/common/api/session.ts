import jwt_decode from 'jwt-decode'
import Cookies from 'js-cookie'
import moment from 'moment'
import { Dict } from '../types'
import env from 'src/common/env'

const SESSION_COOKIE_NAME = '_gl_sess_beta'

interface SessionJWT {
  iat: number
  exp: number
  authToken: string
}

export class NullSession {
  token = { token: '' }

  isValid() {
    return false
  }
  issueAt() {
    return moment()
  }
  expiresAt() {
    return moment()
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

export class Session {
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
    return moment(this.data.iat * 1000)
  }

  expiresAt() {
    return moment(this.data.exp * 1000)
  }

  isExpired() {
    return this.expiresAt() < moment()
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
