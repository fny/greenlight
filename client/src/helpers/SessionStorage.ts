import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'

export enum StorageKeys {
  REGISTERING_USER = 'GL.registering_user',
  REGISTERING_LOCATION = 'GL.registering_location',
}
/**
 * Singleton that wraps the sessionStorage API
 */
const SessionStorage = {
  serialize(key: StorageKeys, value: any): string {
    const serialized = JSON.stringify(value)
    sessionStorage.setItem(key, serialized)
    return serialized
  },

  deserialize<T>(key: StorageKeys): T | null {
    const stored = sessionStorage.getItem(key)
    if (!stored) { return null }
    return JSON.parse(stored)
  },

  delete(key: StorageKeys): void {
    sessionStorage.removeItem(key)
  },

  getRegisteringUser(): RegisteringUser | null {
    return SessionStorage.deserialize<RegisteringUser>(StorageKeys.REGISTERING_USER)
  },

  setRegisteringUser(user: RegisteringUser): string {
    return SessionStorage.serialize(StorageKeys.REGISTERING_USER, user)
  },

  deleteRegisteringUser(): void {
    SessionStorage.delete(StorageKeys.REGISTERING_USER)
  },

  getRegisteringLocation(): RegisteringLocation | null {
    return SessionStorage.deserialize<RegisteringLocation>(StorageKeys.REGISTERING_LOCATION)
  },

  setRegisteringLocation(location: RegisteringLocation): string {
    return SessionStorage.serialize(StorageKeys.REGISTERING_LOCATION, location)
  },

  deleteRegisteringLocation(): void {
    SessionStorage.delete(StorageKeys.REGISTERING_LOCATION)
  },
}

export default SessionStorage
