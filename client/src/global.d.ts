import 'reactn'
import { I18n } from '@lingui/core'
import { User } from 'src/lib/models'

declare module 'reactn/default' {
  export interface State {
    locale: 'en' | 'es'
    currentUser: User | null
    i18n: I18n
    isAPIOnline?: boolean
    isInternetOnline?: boolean
  }
}
