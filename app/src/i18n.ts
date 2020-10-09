import { setupI18n } from '@lingui/core'
import * as en from './locales/en/messages'
import * as es from './locales/es/messages'


export const i18n = setupI18n({
  language: 'en',
  catalogs: { en, es }
})
