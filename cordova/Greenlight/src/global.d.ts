// import { I18n } from '@lingui/core'
import 'reactn'
import { Dispatch } from 'react'
import { I18n } from '@lingui/core'
import { User } from './models'

declare module 'reactn/default' {
  export interface Reducers {
    increment: (
      global: State,
      dispatch: Dispatch,
      i: number,
    ) => Pick<State, 'x'>
  }

  export interface State {
    locale: 'en' | 'es'
    currentUser: User | null
    i18n: I18n
    flashMessage: string
    isAPIOnline?: boolean
    isInternetOnline?: boolean
    x: number
  }
}
