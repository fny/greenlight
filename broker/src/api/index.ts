import axios from 'axios'
import jwt from 'jsonwebtoken'
import Cookies from 'js-cookie'
import moment from 'moment'

const SESSION_COOKIE_NAME = '_gl_sess'
const SESSION_REMEBER_ME_DAYS = 30

const v1 = axios.create({
  // TODO: ENV
  baseURL: 'http://localhost/api/v1/',
  timeout: 1000,
})


interface SessionJWT {
  iat: number
  exp: number
  authToken: string
}

class NullToken {
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
}

class SessionToken {
  token: string
  data: SessionJWT

  static init() {
    const sessionCookie = Cookies.get(SESSION_COOKIE_NAME)
    if (sessionCookie) {
      const token = new SessionToken(sessionCookie)
      if (!token.isExpired()) {
        return token
      }
    }
    return new NullToken()
  }

  constructor(token: string) {
    this.token = token
    this.data = jwt.verify(token, 'TODO_JWT_PUBLIC_KEY') as SessionJWT
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

  saveCookie(expiry?: number) {
    if (expiry) {
      Cookies.set(SESSION_COOKIE_NAME, this.token, { expires: expiry })
    } else {
      Cookies.set(SESSION_COOKIE_NAME, this.token)
    }   
  }

  headers() {
    return { 'Authorization': `Bearer ${this.token}`}
  }
}

let session = SessionToken.init()

//
// Authentication
//

export async function signIn(emailOrMobile: string, password: string, rememberMe: boolean) {
  const response = await v1.post('auth/sign-in', {
      emailOrMobile,
      password,
      rememberMe,
      userAgent: navigator.userAgent
    })
    
  
  session = new SessionToken(response.data.token)
  if (rememberMe) {
    session.saveCookie(SESSION_REMEBER_ME_DAYS)
  }
}

export function signOut() {
  return v1.delete('auth/sign-out', { headers: session.headers() })
}
