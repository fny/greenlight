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

export class MyI18n {
  catalogs = { en, es }
  locale: 'en' | 'es' = getGlobal().locale || Cookies.get('_gl_locale') || 'en'
  current: Dict<any> = es.messages

  messages() {
    return this.catalogs[this.locale].messages as any
  }

  _(message: string | MessageDescriptor) {
    const messageId = (typeof message === 'string') ? message : message.id || 'unknown'
    let translated = this.messages()[messageId] || ''
    if (translated === "" || translated === null) {
      if (typeof message !== 'string' && message.message) {
        translated = message.message
      } else {
        translated = (this.catalogs['en'] as any)[messageId] || messageId
      }
    }
    // TODO: SUPER HACK
    if (Array.isArray(translated) && (typeof message !== 'string') && message.message) {
      let m = message.message
      let out = ''
      for(const t of translated) {
        if (!Array.isArray(t)) {
          m = m.replace(t, '')
        }
      }

      for(const t of translated) {
        out += Array.isArray(t) ? m : t
      }
      return out
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
  Cookies.set('_gl_locale', getGlobal().locale === 'en' ? 'es' : 'en')
  window.location.reload()
}

interface Props {
  id: string
  children?: React.ReactNode
}

export class MyTrans extends React.Component<any, any>{

  render() {

    let compiledTranslation = this.global.i18n.__(this.props.id || this.props.children)
    // console.log(this.global.i18n.locale, compiledTranslation)
    if (compiledTranslation === this.props.id) {
      return this.props.children
    }


    if (typeof compiledTranslation === 'string') {
      compiledTranslation = compiledTranslation.replace(/\<\/?\d+\>/g, '|').split('|')
      if (typeof compiledTranslation === 'string') {
        // console.log(compiledTranslation)
        return compiledTranslation
      }
    }

    const children = React.Children.toArray(this.props.children)

    const processedChildren = (compiledTranslation as any[]).map((trans: any, i) => {
      if (typeof trans === 'string' && typeof children[i] === 'string') {
        // console.log('string,string', trans, children[i])
        return trans
      }

      if (typeof trans === 'string' && typeof children[i] === 'object') {
        // console.log('string,obj', trans, children[i])

        return React.cloneElement(children[i] as ReactElement, {
          children: trans
        })
      } else {
        if (typeof children[i] === 'string') {
          // console.log('string,?', trans, children[i])
          return children[i]
        }
        return children[i]
      }
    })

    // console.log('result', processedChildren)

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
