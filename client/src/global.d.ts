import 'reactn'
import { I18n } from '@lingui/core'
import { CurrentUser } from 'src/models'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { Router } from 'framework7/modules/router/router'

declare module 'reactn/default' {
  export interface State {
    locale: 'en' | 'es'
    currentUser: CurrentUser | null
    currentRoute?: Router.Route
    i18n: I18n
    isAPIOnline?: boolean
    isInternetOnline?: boolean
    registeringUser: RegisteringUser
    registeringUserDetail: string
    registeringLocation: RegisteringLocation
    test: string | null
    progress: number | null
  }
}
