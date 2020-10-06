import { createProvider } from 'reactn'
import { User } from './common/models'

interface InitialState {
  currentUser: User | null
  language: string
}

const INITIAL_STATE: InitialState =  {
  currentUser: null,
  language: 'en'
}

export const Provider = createProvider(INITIAL_STATE)
