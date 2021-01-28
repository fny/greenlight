import { setGlobal } from 'reactn'
import { i18n } from 'src/i18n'
import LocalStorage from 'src/helpers/LocalStorage'

import { cookieLocale } from 'src/helpers/global'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { f7, f7ready } from 'framework7-react'
import { string } from 'yup'

export class Filters {
  filters: string[]

  constructor() {
    this.filters = ['student', 'staff', 'teacher']
  }

  addAll(items: string[]): Filters {
    this.filters = [...this.filters, ...items]
    return this
  }

  removeAll(items: string[]): Filters {
    this.filters = this.filters.filter((value) => items.indexOf(value) === -1)
    return this
  }
}

setGlobal({
  locale: cookieLocale(),
  i18n,
  currentUser: null,
  test: null,
  registeringUser: LocalStorage.getRegisteringUser() || new RegisteringUser(),
  registeringUserDetail: '',
  registeringLocation: LocalStorage.getRegisteringLocation() || new RegisteringLocation(),
  progress: null,
  filters: new Filters(),
  toggleForceUpdate: false,
})

i18n.activate(cookieLocale())

f7ready((f7) => {
  f7.on('routeChange', (newRoute) => {
    setGlobal({ currentRoute: newRoute })
  })
})
