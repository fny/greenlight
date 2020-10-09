import { createProvider } from 'reactn'
import { User } from './common/models'

interface InitialState {
  currentUser: User | null
  locale: string
}

const INITIAL_STATE: InitialState =  {
  currentUser: null,
  locale: 'en'
}

export const Provider = createProvider(INITIAL_STATE)
