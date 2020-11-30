import axios, { AxiosResponse } from 'axios'

import { getGlobal, setGlobal } from 'reactn'
import {
  assertArray, assertNotArray, assertNotNull, assertNotUndefined, transformForAPI,
} from 'src/helpers/util'
import Honeybadger from 'honeybadger-js'

import logger from 'src/helpers/logger'
import { LocationAccount } from 'src/models/LocationAccount'
import env from '../config/env'
import { transformRecordResponse, recordStore } from './stores'
import { RecordResponse } from '../types'
import {
  User, Location, Model, MedicalEvent, GreenlightStatus, UserSettings,
} from '../models'

const BASE_URL = `${env.API_URL}/v1`

logger.dev(BASE_URL)

export const v1 = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  withCredentials: true,
})

v1.interceptors.request.use((request) => {
  logger.dev(`[Request] ${request.method} ${request.url}`)
  request.headers['X-GL-Locale'] = getGlobal().locale
  return request
})

v1.interceptors.response.use(
  (response) => {
    logger.dev('[Response]', response)
    return response
  },
  (error) => {
    logger.dev('[Response Error]', error, error.response)

    if (error.response) {
      const response = error.response as AxiosResponse
      // Unauthorized errors should lead to a sign out
      if (response.status === 401) {
        setGlobal({ currentUser: null })
      }
      throw error
    } else if (error.request) {
      setGlobal({
        isAPIOnline: false,
        isInternetOnline: navigator.onLine,
      })
      throw error
    } else {
      throw error
    }
  },
)

export const store = recordStore

//
// Authentication
//

export async function createSession(emailOrMobile: string, password: string, rememberMe: boolean) {
  await v1.post('sessions', {
    emailOrMobile,
    password,
    rememberMe,
  })
}

export async function deleteSession() {
  await v1.delete('/sessions')
}

export async function createMagicSignIn(emailOrMobile: string, rememberMe: boolean) {
  await v1.post<any>('/magic-sign-in', {
    emailOrMobile,
    rememberMe,
  })
}

export async function magicSignIn(token: string, rememberMe: boolean) {
  await v1.post(`/magic-sign-in/${token}`, {
    rememberMe,
  })
}

//
// Locations
//

export async function getLocation(id: string): Promise<Location> {
  return getResource<Location>(`/locations/${id}`)
}

export async function createLocation(attrs: Partial<Location>): Promise<Location> {
  const response = await v1.post<RecordResponse<Location>>('/locations',
    transformForAPI(attrs))

  const entity = transformRecordResponse<Location>(response.data)
  assertNotArray(entity)
  return entity
}

export async function joinLocation(location: Location): Promise<LocationAccount> {
  const response = await v1.post<RecordResponse<LocationAccount>>(`/locations/${location.id}/join`)

  const entity = transformRecordResponse<LocationAccount>(response.data)
  assertNotArray(entity)
  return entity
}

export async function updateLocationAccount(locationAccount: LocationAccount, updates: Partial<LocationAccount>): Promise<LocationAccount> {
  const response = await v1.patch<RecordResponse<LocationAccount>>(`/location-accounts/${locationAccount.id}`,
    transformForAPI(updates))

  const entity = transformRecordResponse<LocationAccount>(response.data)
  assertNotArray(entity)
  return entity
}

//
// Users
//

export async function getCurrentUser(): Promise<User> {
  const user = await getResource<User>('/current-user')
  Honeybadger.setContext({ userId: user.id })
  return user
}

export async function getUser(id: string): Promise<User> {
  return getResource<User>(`/users/${id}`)
}

export async function updateUser(user: User, updates: Partial<User>): Promise<User> {
  const response = await v1.patch<RecordResponse<User>>(`/users/${user.id}`,
    transformForAPI(updates))

  const entity = transformRecordResponse<User>(response.data)
  assertNotArray(entity)
  return entity
}

export async function completeWelcomeUser(user: User): Promise<User> {
  const response = await v1.put<RecordResponse<User>>(`/users/${user.id}/complete-welcome`)
  const entity = transformRecordResponse<User>(response.data)
  assertNotArray(entity)
  return entity
}

export async function createUserAndSignIn(user: Partial<User>) {
  const response = await v1.post<RecordResponse<User>>('/users/create-and-sign-in', user)
  const entity = transformRecordResponse<User>(response.data)
  assertNotArray(entity)
  return entity
}

export async function updateUserSettings(user: User, updates: Partial<UserSettings>) {
  const response = await v1.patch<RecordResponse<UserSettings>>(`/users/${user.id}/settings`,
    transformForAPI(updates))
  const entity = transformRecordResponse<UserSettings>(response.data)
  assertNotArray(entity)
  return entity
}

export async function getUsersForLocation(location: number | string | Location) {
  const locationId = location instanceof Location ? location.id : location
  const path = `/locations/${locationId}/users`
  return getResources<User>(path) as Promise<User[]>
}

//
// Surveys
//

export async function createSymptomSurvey(user: User, medicalEvents: Partial<MedicalEvent>[]): Promise<string | null> {
  const payload = {
    medicalEvents,
  }
  const response = await v1.post<RecordResponse<GreenlightStatus>>(
    `/users/${user.id}/symptom-surveys`,
    transformForAPI(payload),
  )
  const record = response.data.data

  assertNotArray(record)
  assertNotUndefined(record.attributes)

  return record.attributes.status || null
}

//
// Helpers
//

export async function getResource<T extends Model>(path: string): Promise<T> {
  const response = await v1.get(path)
  assertNotNull(response.data.data)
  recordStore.writeRecordResponse(response.data)
  const entity = transformRecordResponse<T>(response.data)
  assertNotArray(entity)
  return entity
}

export async function getResources<T extends Model>(path: string): Promise<T | T[]> {
  const response = await v1.get(path)
  if (!response.data.data) return []
  recordStore.writeRecordResponse(response.data)
  const entities = transformRecordResponse<T>(response.data)
  assertArray(entities)
  return entities
}
