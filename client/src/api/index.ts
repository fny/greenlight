import axios, { AxiosResponse } from 'axios'

import { getGlobal, setGlobal } from 'reactn'
import { assertArray, assertNotArray, assertNotNull, assertNotUndefined, transformForAPI } from 'src/helpers/util'

// FIXME: This shouldn't be assigned here. It should go in a provider
import Honeybadger from 'honeybadger-js'

import logger from 'src/helpers/logger'
import env from 'src/config/env'
import {
  User,
  Location,
  LocationAccount,
  Model,
  MedicalEvent,
  GreenlightStatus,
  UserSettings,
  CurrentUser,
} from 'src/models'
import { Dict, RecordResponse } from 'src/types'
import useSWR, { responseInterface } from 'swr'
import { GreenlightStatusTypes } from 'src/models/GreenlightStatus'
import qs from 'qs'
import { Roles } from 'src/models/LocationAccount'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { transformRecordResponse, recordStore } from './stores'

const BASE_URL = `${env.API_URL}/v1`

logger.dev(BASE_URL)

export const v1 = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'X-Client-Env': env.isCordova() ? 'cordova' : 'standard',
  },
  paramsSerializer: (params) => qs.stringify(params),
})

v1.interceptors.request.use((request) => {
  logger.dev(`[Request] ${request.method} ${request.url} ${request.params ? JSON.stringify(request.params) : ''}`)
  request.headers['X-GL-Locale'] = getGlobal().locale

  if (env.isCordova()) {
    const token = localStorage.getItem('token')
    if (token) {
      request.headers.Authorization = `Bearer ${token}`
    }
  }

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

export async function createSession(emailOrMobile: string, password: string, rememberMe: boolean): Promise<void> {
  const response = await v1.post('sessions', {
    emailOrMobile,
    password,
    rememberMe,
  })
  if (env.isCordova()) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('rememberMe', rememberMe.toString())
  }
}

export async function deleteSession(): Promise<void> {
  await v1.delete('/sessions')
}

export async function createMagicSignIn(emailOrMobile: string, rememberMe: boolean): Promise<void> {
  await v1.post<any>('/magic-sign-in', {
    emailOrMobile,
    rememberMe,
  })
}
export async function magicSignIn(token: string, rememberMe: boolean): Promise<void> {
  const response = await v1.post(`/magic-sign-in/${token}`, {
    rememberMe,
  })
  if (env.isCordova()) {
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('rememberMe', rememberMe.toString())
  }
}

export async function passwordResetRequest(emailOrMobile: string): Promise<void> {
  await v1.post('/password-resets', {
    emailOrMobile,
  })
}

export async function checkPasswordResetToken(token: string): Promise<void> {
  await v1.get(`/password-resets/${token}/valid`)
}

export async function passwordReset(token: string, password: string): Promise<void> {
  await v1.post(`/password-resets/${token}`, {
    password,
  })
}

//
// Locations
//

export async function getLocation(id: string): Promise<Location> {
  return getResource<Location>(`/locations/${id}`)
}

export async function createLocation(attrs: Partial<Location>): Promise<Location> {
  const response = await v1.post<RecordResponse<Location>>('/locations', transformForAPI(attrs))

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

export async function updateLocationAccount(
  locationAccount: LocationAccount,
  updates: Partial<LocationAccount>,
): Promise<LocationAccount> {
  const response = await v1.patch<RecordResponse<LocationAccount>>(
    `/location-accounts/${locationAccount.id}`,
    transformForAPI(updates),
  )

  const entity = transformRecordResponse<LocationAccount>(response.data)
  assertNotArray(entity)
  return entity
}

export async function checkLocationRegistrationCode(locationId: string, registrationCode: string): Promise<any> {
  const result = await v1.post(`/locations/${locationId}/check-registration-code`, {
    registrationCode,
  })
  return result.data.result
}

export async function registerUser(locationId: string, user: RegisteringUser & { password: string}) {
  const userWithoutBlanks = transformForAPI(user, { removeBlanks: true })
  await v1.post(`/locations/${locationId}/register`, userWithoutBlanks)
  const currentUser = await getCurrentUser()
  setGlobal({ currentUser })
}

//
// Users
//

export async function getCurrentUser(): Promise<CurrentUser> {
  const currentUser = await getResource<CurrentUser>('/current-user')
  Honeybadger.setContext({ userId: currentUser.id })
  // Now load the standard user entity so it gets cached too
  await getResource<User>(`/users/${currentUser.id}`)
  return currentUser
}

export async function updateCurrentUser(updates: Partial<CurrentUser>): Promise<CurrentUser> {
  const response = await v1.patch<RecordResponse<User>>('/current-user', transformForAPI(updates))

  const entity = transformRecordResponse<CurrentUser>(response.data)
  assertNotArray(entity)
  return entity
}

export async function getUser(id: string): Promise<User> {
  return getResource<User>(`/users/${id}`)
}

export async function updateUser(user: User, updates: Partial<User>): Promise<User> {
  const response = await v1.patch<RecordResponse<User>>(`/users/${user.id}`, transformForAPI(updates))

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

export async function createUserAndSignIn(user: Partial<RegisteringUser> & { password: string}): Promise<void> {
  const signInResponse = await v1.post('/users/create-and-sign-in', user)
  if (env.isCordova()) {
    localStorage.setItem('token', signInResponse.data.token)
  }
}

export async function updateUserSettings(user: User, updates: Partial<UserSettings>): Promise<UserSettings> {
  const response = await v1.patch<RecordResponse<UserSettings>>(`/users/${user.id}/settings`, transformForAPI(updates))
  const entity = transformRecordResponse<UserSettings>(response.data)
  assertNotArray(entity)
  return entity
}

export async function getUsersForLocation(location: number | string | Location): Promise<User[]> {
  const locationId = location instanceof Location ? location.id : location
  const path = `/locations/${locationId}/users`
  return getResources<User>(path)
}

export async function getPagedUsersForLocation(
  location: number | string | Location,
  page: number = 1,
  name?: string,
  status?: GreenlightStatusTypes,
  role?: Roles,
): Promise<PagedResource<User>> {
  const locationId = location instanceof Location ? location.id : location
  const path = `/locations/${locationId}/users`
  return getPagedResources<User>(path, page, { status, name, role })
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

export async function deleteLastGreenlightStatus(user: User): Promise<string | null> {
  return await v1.delete(`/users/${user.id}/last-greenlight-status`)
}

export async function updateGreenlightStatus(
  user: User,
  status: string,
  expirationDate: string,
): Promise<string | null> {
  const response = await v1.patch<RecordResponse<GreenlightStatus>>(
    `/users/${user.id}/last-greenlight-status`,
    transformForAPI({
      status,
      expirationDate,
    }),
  )

  const record = response.data.data

  assertNotArray(record)
  assertNotUndefined(record.attributes)

  return record.attributes.status || null
}

//
// Mailman
//

export function mailHelloAtGreenlight(subject: string, body: string): Promise<AxiosResponse<any>> {
  return v1.post('mail/hello-at-greenlight', {
    subject,
    body,
  })
}

export function mailInvite(emailOrMobile: string): Promise<AxiosResponse<any>> {
  return v1.post('mail/invite', {
    emailOrMobile,
  })
}

//
// Util
//

export async function getEmailTaken(email: string): Promise<boolean> {
  const res = await v1.get<{ taken: boolean }>('/util/email-taken', { params: { email } })
  return res.data.taken
}

export async function getMobileTaken(mobile: string): Promise<boolean> {
  const res = await v1.get<{ taken: boolean }>('/util/mobile-taken', { params: { mobile } })
  return res.data.taken
}

export async function getEmailOrMobileTaken(value: string): Promise<boolean> {
  const res = await v1.get<{ taken: boolean }>('/util/email-or-mobile-taken', { params: { value } })
  return res.data.taken
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

export async function getResources<T extends Model>(path: string): Promise<T[]> {
  const response = await v1.get(path)
  if (!response.data.data) return []
  recordStore.writeRecordResponse(response.data)
  const entities = transformRecordResponse<T>(response.data)
  assertArray(entities)
  return entities
}

//
// Pagination and Filtering
//

export interface PagedResource<T> {
  data: T[]
  filter: Filter
  pagination: Pagination
}

export interface Pagination {
  /** The number of the next page */
  next: number
  /** The number of the last page */
  last: number
  /** The total number of elements across all pages */
  total: number
}

export async function getPagedResources<T extends Model>(
  path: string,
  page?: number,
  filter: Filter = {},
): Promise<PagedResource<T>> {
  const response = await v1.get(path, { params: { page, filter } })
  recordStore.writeRecordResponse(response.data)
  const entities = transformRecordResponse<T>(response.data)
  assertArray(entities)

  const pagination = response.data.meta.pagination as Pagination
  return {
    data: entities,
    filter,
    pagination,
  }
}

export type Filter = Dict<string | number | string[] | number[] | undefined | null>

export function usePagedResources<T extends Model>(
  path: string,
  page?: number,
  filter?: Filter,
): responseInterface<PagedResource<T>, any> {
  return useSWR([path, page, filter], (path, page, filter) => getPagedResources<T>(path, page, filter))
}
