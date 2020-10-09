import 'reactn'
import { User } from './common/models'

declare module 'reactn/default' {
  export interface Reducers {

    doNothing: (global: State, dispatch: Dispatch) => null
  }

  export interface State {
    locale: string
    currentUser: User | null
  }
}
