import 'reactn'
import { I18n } from '@lingui/core'
import { User } from 'src/lib/models'
import { GRegisteringLocation, GRegisteringUser } from './initializers/providers'

declare module 'reactn/default' {
  export interface State {
    locale: 'en' | 'es'
    currentUser: User | null
    currentUserX: User | null
    i18n: I18n
    isAPIOnline?: boolean
    isInternetOnline?: boolean
    registeringUser: GRegisteringUser
    registeringLocation: GRegisteringLocation
    test: string | null
  }
}
