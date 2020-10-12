import Cookies from 'js-cookie'
import { createProvider, setGlobal } from 'reactn'
import { User } from 'src/common/models'
import { myI18n } from 'src/i18n'

interface InitialState {
  currentUser: User | null
  locale: string
}

const INITIAL_STATE: InitialState =  {
  currentUser: null,
  locale: 'en'
}

export const Provider = createProvider(INITIAL_STATE)


setGlobal({
  locale: Cookies.get('_gl_locale') || 'en',
  i18n: myI18n
})
