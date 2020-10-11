import { User, Location, Model, MedicalEvent, GreenlightStatus } from '../models'
import { RecordResponse, TokenResponse } from '../types'
import { transformRecordResponse, responseStore, recordStore } from './stores'
import axios, { AxiosResponse } from 'axios'

import { Session, NullSession } from './session'
import { getGlobal, setGlobal } from 'reactn'
import { assertNotArray, assertNotUndefined, transformForAPI } from '../util'
import env from '../env'

const BASE_URL = `${env.API_URL}/v1`
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
  try {
    destroySession()
  } catch(err) {
    console.error(err)
  }

  (window.location as any) = '/'
  return response
}

export async function getCurrentUser(): Promise<User> {
  const user = await getResource<User>('/users/me')
  assertNotArray(user)
  return user
}

export async function getUser(id: string): Promise<User> {
  const user = await getResource<User>(`/users/${id}`)
  assertNotArray(user)
  return user
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

export async function getUsersForLocation(location: number | string | Location) {
  const locationId = location instanceof Location ? location.id : location
  const path = `/locations/${locationId}/users`
  return getResource<User>(path, true) as Promise<User[]>
}

export async function createSymptomSurvey(user: User, medicalEvents: Partial<MedicalEvent>[]): Promise<string | null> {
  const payload = {
    medicalEvents
  }
  const response = await v1.post<RecordResponse<GreenlightStatus>>(`/users/${user.id}/symptom-surveys`, transformForAPI(payload), {
    headers: session.headers()
  })
  const record = response.data.data

  assertNotArray(record)
  assertNotUndefined(record.attributes)

  return record.attributes.status || null
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


export async function reloadCurrentUser(): Promise<User> {
  const user = await getCurrentUser()
  setGlobal({ currentUser: user })
  return user
}
