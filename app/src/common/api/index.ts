import { User, Location, Model, MedicalEvent, GreenlightStatus } from '../models'
import { TokenResponse } from '../types'
import { transformRecordResponse, responseStore, recordStore } from './stores'
import axios, { AxiosResponse } from 'axios'

import { Session, NullSession } from './session'
import { getGlobal } from 'reactn'
import { transformForAPI } from '../util'

const BASE_URL = "http://api-dev.greenlightready.com/v1"
const REMEBER_ME_DAYS = 30

export const v1 = axios.create({
  baseURL: BASE_URL,
  timeout: 3000
})

export const stores = { recordStore, responseStore }

export let session = Session.init()

//
// Authentication
//

export async function signIn(emailOrMobile: string, password: string, rememberMe: boolean) {
  const data = (await v1.post<TokenResponse>('sessions', {
    emailOrMobile,
    password,
    rememberMe,
  })).data
  createSession(data, rememberMe)
  return getCurrentUser()
}

export async function createMagicSignIn(emailOrMobile: string, rememberMe: boolean) {
  await v1.post<any>('/magic-sign-in', {
    emailOrMobile,
    rememberMe
  })
}

export async function magicSignIn(token: string, rememberMe: boolean) {
  const data = (await v1.post<TokenResponse>(`/magic-sign-in/${token}`, {
    rememberMe: rememberMe
  })).data

  createSession(data, rememberMe)
  return getCurrentUser()
}

export async function signOut() {
  const response = await v1.delete('/sessions', { headers: session.headers() })
  destroySession()
  return response
}

export async function getCurrentUser(): Promise<User> {
  // TODO: getResource and getResources
 return await getResource<User>('/users/me') as User
}

// TODO clear blanks and format values
export async function updateUser(user: User, updates: Partial<User>): Promise<User> {
  await v1.patch(`/users/${user.id}`, 
    updates,
    { headers: session.headers() }
  )
  // TODO: This should update the store instead.
  return getCurrentUser()
}

export async function findUsersForLocation(location: string | Location) {
  const locationId = typeof location === 'string' ? location : location.id
  const path = `/locations/${locationId}/users`
  return getResource<User>(path, true) as Promise<User[]>
}

export async function createSymptomSurvey(user: User, medicalEvents: Partial<MedicalEvent>[], greenlightStatus: Partial<GreenlightStatus>) {
  const payload = {
    medicalEvents,
    greenlightStatus
  }
  await v1.post(`/users/${user.id}/symptom-surveys`, transformForAPI(payload), {
    headers: session.headers()
  })
}

export async function getResource<T extends Model>(path: string, cache = false) {
  const responseTransform = (res: AxiosResponse<any>) => ( transformRecordResponse<T>(res.data) )
  if (cache) {
    if (responseStore.has(path)) {
      return responseTransform(responseStore.get(path))
    }
  }

  const response = await v1.get(path, { headers: session.headers() })
  if (cache) {
    responseStore.set(path, response)
  }
  recordStore.loadRecordResponse(response.data)
  return responseTransform(response)
}

function createSession(doc: TokenResponse, rememberMe: boolean) {
  session = new Session(doc.token)
  if (rememberMe) {
    session.saveCookie(REMEBER_ME_DAYS)
  } else {
    session.saveCookie()
  } 
}

export function destroySession() {
  session.removeCookie()
  session = new NullSession()
  responseStore.reset()
  recordStore.reset()
}

export function isSignedIn() {
  const currentUser = getGlobal().currentUser
  return session.isValid() && currentUser !== null && currentUser !== undefined
}

export function currentUser() {
  return getGlobal().currentUser
}
