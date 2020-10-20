import Cookies from 'js-cookie'
import { createProvider, setGlobal } from 'reactn'
import { User } from 'src/common/models'
import { cookieLocale, myI18n } from 'src/i18n'

setGlobal({
  locale: cookieLocale(),
  i18n: myI18n
})
