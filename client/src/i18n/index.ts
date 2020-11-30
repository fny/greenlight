import { i18n } from '@lingui/core'

import * as plurals from 'make-plural/plurals'
import en from './locales/en'
import es from './locales/es'

export { i18n }

i18n.loadLocaleData('en', { plurals: plurals.en })
i18n.loadLocaleData('es', { plurals: plurals.es })

i18n.load('en', en.messages)
i18n.load('es', es.messages)
i18n.activate('en')
export type GLLocales = 'en' | 'es'
