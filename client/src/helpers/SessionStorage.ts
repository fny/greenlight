import { GRegisteringLocation, GRegisteringUser } from 'src/initializers/providers'

export enum StorageKeys {
  REGISTERING_USER = 'GL.registering_user',
  REGISTERING_LOCATION = 'GL.registering_location',
}

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
    sessionStorage.deleteItem(key)
  },

  getRegisteringUser(): GRegisteringUser | null {
    return SessionStorage.deserialize<GRegisteringUser>(StorageKeys.REGISTERING_USER)
  },
  setRegisteringUser(user: GRegisteringUser): string {
    return SessionStorage.serialize(StorageKeys.REGISTERING_USER, user)
  },
  deleteRegisteringUser(): void {
    SessionStorage.delete(StorageKeys.REGISTERING_USER)
  },
  getRegisteringLocation(): GRegisteringLocation | null {
    return SessionStorage.deserialize<GRegisteringLocation>(StorageKeys.REGISTERING_LOCATION)
  },
  setRegisteringLocation(location: GRegisteringLocation): string {
    return SessionStorage.serialize(StorageKeys.REGISTERING_LOCATION, location)
  },
  deleteRegisteringLocation(): void {
    SessionStorage.delete(StorageKeys.REGISTERING_LOCATION)
  },

}

export default SessionStorage
