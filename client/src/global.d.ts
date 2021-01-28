import 'reactn'
import { I18n } from '@lingui/core'
import { User } from 'src/models/User'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { Router } from 'framework7/modules/router/router'
import { Filters } from './initializers/global'

declare module 'reactn/default' {
  export interface State {
    locale: 'en' | 'es'
    currentUser: User | null
    currentRoute?: Router.Route
    i18n: I18n
    isAPIOnline?: boolean
    isInternetOnline?: boolean
    registeringUser: RegisteringUser
    registeringUserDetail: string
    registeringLocation: RegisteringLocation
    test: string | null
    progress: number | null
    filters: Filters
  }
}
