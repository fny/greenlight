// import { I18n } from '@lingui/core'
import 'reactn'
import { User } from './common/models'
import { MyI18n } from './i18n'

declare module 'reactn/default' {
  export interface Reducers {
    doNothing: (global: State, dispatch: Dispatch) => null
  }

  export interface State {
    locale: 'en' | 'es'
    currentUser: User | null
    i18n: MyI18n
  }
}
