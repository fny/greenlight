import 'reactn'
import { I18n } from '@lingui/core'
import { User } from 'src/models/User'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { Filters } from './initializers/global'

declare module 'reactn/default' {
  export interface State {
    locale: 'en' | 'es'
    currentUser: User | null
    i18n: I18n
    isAPIOnline?: boolean
    isInternetOnline?: boolean
    registeringUser: RegisteringUser
    registeringLocation: RegisteringLocation
    test: string | null
    progress: number | null
    filters: Filters
  }
}
