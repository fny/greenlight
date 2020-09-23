import { User, Location, Model } from '../models'
import { TokenDocument } from '../types';
import { transformRecordDocument, responseStore, recordStore } from './stores'
import axios, { AxiosResponse } from 'axios';

import { Session, NullSession } from './session'
import { getGlobal } from 'reactn';

const BASE_URL = "http://localhost:3000/api/v1"
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
  const data = (await v1.post<TokenDocument>('sessions', {
    emailOrMobile,
    password,
    rememberMe,
  })).data
  
  session = new Session(data.token)
  getCurrentUser()

  if (rememberMe) {
    session.saveCookie(REMEBER_ME_DAYS)
  } else {
    session.saveCookie()
  } 
}

export async function magicSignIn(emailOrMobile: string, rememberMe: boolean) {
  const data = (await v1.post<TokenDocument>('sessions', {
    emailOrMobile,
    rememberMe,
  })).data
}

export async function signOut() {
  const response = await v1.delete('sessions', { headers: session.headers() })
  destroySession()
  return response
}

export async function getCurrentUser() {
 return await getResource<User>('/users/me') as User
}

export async function findUsersForLocation(location: string | Location) {
  const locationId = typeof location === 'string' ? location : location.id
  const path = `/locations/${locationId}/users`
  return getResource<User>(path, true) as Promise<User[]>
}

export async function getResource<T extends Model>(path: string, cache: boolean = false) {
  const responseTransform = (res: AxiosResponse<any>) => ( transformRecordDocument<T>(res.data) )
  if (cache) {
    if (responseStore.has(path)) {
      return responseTransform(responseStore.get(path))
    }
  }
  const response = await v1.get(path, { headers: session.headers()})
  if (cache) {
    responseStore.set(path, response)
  }
  recordStore.loadRecordDocument(response.data)
  return responseTransform(response)
}

export function destroySession() {
  session.removeCookie()
  session = new NullSession()
  responseStore.reset()
  recordStore.reset()
}

export function isSignedIn() {
  const currentUser: User | undefined = getGlobal().currentUser
  return session.isValid() && currentUser !== null && currentUser !== undefined
}

export function currentUser() {
  const user: User | undefined = getGlobal().currentUser
  return user || null
}