import { MessageDescriptor, setupI18n } from '@lingui/core'
import { MessageOptions } from '@lingui/core/cjs/i18n'
import Cookies from 'js-cookie'
import { isLength } from 'lodash'
import { ReactElement } from 'react'
import React from 'reactn'
import { Fragment, getGlobal, setGlobal } from 'reactn'
import { Dict } from './common/types'
import en from './locales/en/messages'
import es from './locales/es/messages'

export const i18n = setupI18n()
;(i18n as any).load('en', en.messages)
;(i18n as any).load('es', es.messages)
i18n.activate('en')


export function isEmpty(obj: any) {
  // null and undefined are "empty"
  if (obj === null || obj === undefined) return true

  if (obj.length > 0) return false
  if (obj.length === 0) return true

  return !Object.getOwnPropertyNames(obj).length
}

type Locales = 'en' | 'es'

export function cookieLocale(): Locales {
  const locale = Cookies.get('_gl_locale') || 'en'
  console.log('THIS IS THE LOCALE', locale)
  return locale as Locales
}

export class MyI18n {
  catalogs = { en, es }
  locale: 'en' | 'es' = cookieLocale()

  messages() {
    return this.catalogs[this.locale].messages as any
  }

  _(message: string | MessageDescriptor) {
    const messageId = (typeof message === 'string') ? message : message.id || 'unknown'
    let translated = this.messages()[messageId]
    if (translated === undefined) {
      console.error(`Missing translation: ${message}`)
    }

    if (translated === null) {
      console.error(`Translation unset: ${message}`)
    }

    if (translated === '') {
      console.error(`Translation is empty string: ${message}`)
    }

    if ([undefined, null, ''].includes(translated)) {
      if (typeof message !== 'string' && message.message) {
        translated = message.message
      } else {
        translated = (this.catalogs['en'] as any)[messageId] || messageId
      }
    }


    if (Array.isArray(translated) && (typeof message !== 'string') && message.message) {
      if (message.values) {
        let out = ''
        for(const t of translated) {
          if (!Array.isArray(t)) {
            out += t
          } else {
            out += message.values[t[0]]
          }
        }
        return out
      } else {
        return 'translation_error'
      }
    }

    return translated
  }

  __(message: string | MessageDescriptor) {
    const messageId = (typeof message === 'string') ? message : message.id || 'unknown'
    let translated = this.messages()[messageId] || ''
    if (translated === "" || translated === null) {
      if (typeof message !== 'string' && message.message) {
        translated = message.message
      } else {
        translated = (this.catalogs['en'] as any)[messageId] || messageId
      }
    }

    return translated
  }
}

export const myI18n = new MyI18n()

export function toggleLocale() {
  const newLocale = cookieLocale() === 'en' ? 'es' : 'en'
  Cookies.set('_gl_locale', newLocale)
  setGlobal({ locale: newLocale })
  window.location.reload()
}

interface Props {
  id: string
  children?: React.ReactNode
}


// Compiled translations may be strings or arrays of string and arrays
export class MyTrans extends React.Component<any, any>{

  render() {

    let compiledTranslation = this.global.i18n.__(this.props.id || this.props.children)
    console.log(this.global.i18n.locale, compiledTranslation)

    // If the compiled translation matches the id, there's no valid translation
    // in the messages, so return the component's children as a default.
    if (compiledTranslation === this.props.id) {
      console.error(`Translation missing for id ${this.props.id}`)
      return this.props.children
    }


    // If the compiled translation is a string...
    if (typeof compiledTranslation === 'string') {
      // ...check if we need to make any nested substitutions "<0>Like this</0>"
      compiledTranslation = compiledTranslation.replace(/\<\/?\d+\>/g, '|').split('|')
      // If its still a string, it's already been translated.
      if (typeof compiledTranslation === 'string') {
        console.log(compiledTranslation)
        return compiledTranslation
      }
    }

    const children = React.Children.toArray(this.props.children)

    // Compiled translation is an array we need to convert
    const processedChildren = (compiledTranslation as any[]).map((trans: any, i) => {
      if (typeof trans === 'string' && typeof children[i] === 'string') {
        console.log('string,string', trans, children[i])
        return trans
      }

      if (typeof trans === 'string' && typeof children[i] === 'object') {
        console.log('string,obj', trans, children[i])
        return React.cloneElement(children[i] as ReactElement, {
          children: trans
        })
      } else {
        if (typeof children[i] === 'string') {
          console.log('string,?', trans, children[i])
          return children[i]
        }
        return children[i]
      }
    })

    console.log('result', processedChildren)

    return React.createElement(React.Fragment, { children: processedChildren })

  }
}

export function myPlural(id: string, count: number, prefix?: boolean): string {
  let translation = getGlobal().i18n._(`plurals.${id}`)
  let parsed
  try {
    translation = translation.replace(/\[/g, '({').replace(/\]/g, '})')
    parsed = eval(translation)
  } catch {
    console.error("Unable to eval", translation)
    return `${id}.error`
  }

  if (count === 1) {
    if (prefix) {
      return `${count} ${parsed['one']}`
    } else {
      return `${parsed['one']}`
    }
  }

  if (prefix) {
    return `${count} ${parsed['other']}`
  } else {
    return `${parsed['other']}`
  }
}
