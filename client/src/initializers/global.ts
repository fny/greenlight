import { setGlobal } from 'reactn'
import { i18n } from 'src/i18n'
import SessionStorage from 'src/helpers/SessionStorage'

import { cookieLocale } from 'src/helpers/global'
import { RegisteringLocation } from 'src/models/RegisteringLocation'
import { RegisteringUser } from 'src/models/RegisteringUser'

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
  registeringUser: SessionStorage.getRegisteringUser() || new RegisteringUser(),
  registeringLocation: SessionStorage.getRegisteringLocation() || new RegisteringLocation(),
  progress: null,
  filters: new Filters(),
})

i18n.activate(cookieLocale())
