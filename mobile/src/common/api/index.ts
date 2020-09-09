import { verify as jwtverify } from 'jsonwebtoken'
import Cookies from 'js-cookie'
import moment from 'moment'

const SESSION_COOKIE_NAME = '_gl_sess'
const SESSION_REMEBER_ME_DAYS = 30
const BASE_URL = "http://localhost:8080/api/v1"

// TODO: Implement timeout
class Requestor {
  baseURL: string
  timeoutMs: number

  constructor(baseURL: string, timeoutMs: number) {
    this.baseURL = baseURL
    this.timeoutMs = timeoutMs
  }

  async post(path: string, data = {}) {
    // Default options are marked with *
    const response = await fetch(`${BASE_URL}/${path}`, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }  

  async delete(path: string, data = {}) {
    // Default options are marked with *
    const response = await fetch(`${BASE_URL}/${path}`, {
      method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }  
}

const v1 = new Requestor(BASE_URL, 1000)


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
    this.data = jwtverify(token, 'TODO_JWT_PUBLIC_KEY') as SessionJWT
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

export let session = SessionToken.init()

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


export async function signInDemo(emailOrMobile: string, password: string, rememberMe: boolean) {

}
