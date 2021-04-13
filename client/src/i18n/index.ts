import React from 'react'

export type GLLocales = 'en' | 'es'

export const MyI18n = React.createContext('en')


export function plural(n: number, subs: { one: string, other: string } ) {
  return n === 1 ? subs.one.replace('#', `${n}`) : subs.other.replace('#', `${n}`)
}
