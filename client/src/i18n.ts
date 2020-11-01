import { setupI18n } from '@lingui/core'

import en from './locales/en/messages'
import es from './locales/es/messages'

export const i18n = setupI18n()

i18n.load('en', en.messages)
i18n.load('es', es.messages)

export type Locales = 'en' | 'es'
