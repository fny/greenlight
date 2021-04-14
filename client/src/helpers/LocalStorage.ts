import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { GuestPass } from 'src/models/GuestPass'

export enum StorageKeys {
  REGISTERING_USER = 'GL.registering_user',
  REGISTERING_LOCATION = 'GL.registering_location',
  GUEST_PASSES = 'GL.guest_passes',
}
/**
 * Singleton that wraps the localStorage API
 */
const LocalStorage = {
  clear(): void {
    localStorage.clear()
  },
  serialize(key: StorageKeys, value: any): string {
    const serialized = JSON.stringify(value)
    localStorage.setItem(key, serialized)
    return serialized
  },

  deserialize<T>(key: StorageKeys): T | null {
    const stored = localStorage.getItem(key)
    if (!stored) { return null }
    return JSON.parse(stored)
  },

  delete(key: StorageKeys): void {
    localStorage.removeItem(key)
  },

  getRegisteringUser(): RegisteringUser | null {
    return LocalStorage.deserialize<RegisteringUser>(StorageKeys.REGISTERING_USER)
  },

  setRegisteringUser(user: RegisteringUser): string {
    return LocalStorage.serialize(StorageKeys.REGISTERING_USER, user)
  },

  deleteRegisteringUser(): void {
    LocalStorage.delete(StorageKeys.REGISTERING_USER)
  },

  getRegisteringLocation(): RegisteringLocation | null {
    return LocalStorage.deserialize<RegisteringLocation>(StorageKeys.REGISTERING_LOCATION)
  },

  setRegisteringLocation(location: RegisteringLocation): string {
    return LocalStorage.serialize(StorageKeys.REGISTERING_LOCATION, location)
  },

  deleteRegisteringLocation(): void {
    LocalStorage.delete(StorageKeys.REGISTERING_LOCATION)
  },

  getGuestPasses(): GuestPass[] {
    return (LocalStorage.deserialize<GuestPass[]>(StorageKeys.GUEST_PASSES) || []).map((p) => {
      const gp = new GuestPass({ ...p._data })
      gp.id = p.id
      gp.name = p.name
      return gp
    })
  },
  setGuestPasses(guestPasses: GuestPass[]) {
    LocalStorage.serialize(StorageKeys.GUEST_PASSES, guestPasses)
  },
  addGuestPass(guestPass: GuestPass) {
    const passes = LocalStorage.getGuestPasses()
    passes.push(guestPass)
    LocalStorage.setGuestPasses(passes)
    return LocalStorage.getGuestPasses()
  },
  removeGuestPass(guestPass: GuestPass) {
    const passes = LocalStorage.getGuestPasses()
    LocalStorage.setGuestPasses(passes.filter((p) => p.id !== guestPass.id))
    return LocalStorage.getGuestPasses()
  },
  clearGuestPasses() {
    LocalStorage.delete(StorageKeys.GUEST_PASSES)
  },
}

export default LocalStorage
