import { User, Location, Model, MedicalEvent, GreenlightStatus } from '../models'
import { RecordResponse } from '../types'
import { transformRecordResponse, recordStore } from './stores'
import axios, { AxiosResponse } from 'axios'

import { setGlobal } from 'reactn'
import { assertArray, assertNotArray, assertNotNull, assertNotUndefined, transformForAPI } from 'src/util'
import env from '../env'
import Honeybadger from 'honeybadger-js'

import * as logger from 'src/logger'

const BASE_URL = `${env.API_URL}/v1`

export const v1 = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  withCredentials: true
})

v1.interceptors.request.use(request => {
  logger.dev(`[Request] ${request.method} ${request.url}`)
  return request
})

v1.interceptors.response.use(
  (response) => {
    logger.dev('[Response]', response)
    return response
  },
  (error) => {
    logger.dev('[Response Error]', error)

    if (!error.response) {
      throw error
    }

    const response = error.response as AxiosResponse
    // Unauthorized errors should lead to a sign out
    if (response.status === 401) {
      setGlobal({ currentUser: null })
    }
    throw error
  }
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
    rememberMe
  })
}

export async function magicSignIn(token: string, rememberMe: boolean) {
  await v1.post(`/magic-sign-in/${token}`, {
    rememberMe: rememberMe
  })
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
  return await getResource<User>(`/users/${id}`)
}

export async function updateUser(user: User, updates: Partial<User>): Promise<User> {
  const response = await v1.patch<RecordResponse<User>>(`/users/${user.id}`,
    transformForAPI(updates)
  )

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
    medicalEvents
  }
  const response = await v1.post<RecordResponse<GreenlightStatus>>(
    `/users/${user.id}/symptom-surveys`,
    transformForAPI(payload)
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
