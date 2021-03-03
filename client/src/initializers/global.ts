import { setGlobal } from 'reactn'
import { i18n } from 'src/i18n'
import LocalStorage from 'src/helpers/LocalStorage'

import { cookieLocale } from 'src/helpers/global'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { f7ready } from 'framework7-react'

setGlobal({
  locale: cookieLocale(),
  i18n,
  currentUser: null,
  test: null,
  registeringUser: LocalStorage.getRegisteringUser() || new RegisteringUser(),
  registeringUserDetail: '',
  registeringLocation: LocalStorage.getRegisteringLocation() || new RegisteringLocation(),
  progress: null,
  toggleForceUpdate: false,
  recordStoreUpdatedAt: null,
})

i18n.activate(cookieLocale())

f7ready((f7) => {
  f7.on('routeChange', (newRoute) => {
    setGlobal({ currentRoute: newRoute })
  })
})
