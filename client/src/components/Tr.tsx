import React, { useContext } from 'react'
import { getGlobal, useGlobal } from 'reactn'
import logger from 'src/helpers/logger'
import { MyI18n } from 'src/i18n'

interface MessageProps {
  // Language specific content
  children: React.ReactNode
}

/**
 * Use this within a <Tr /> to specify an english block
 *
 * @param props Language specific content
 */
export function En(props: MessageProps): JSX.Element {
  return <>{props.children}</>
}

/**
 * Use this within a <Tr /> to specify a spanish block
 *
 * @param props Language specific content
 */
export function Es(props: MessageProps): JSX.Element {
  return <>{props.children}</>
}

interface TrFunctionProps {
  /** English content */
  en: string

  /** Spanish content */
  es: string

  /** Whether this translation needs to be reviewed */
  reviewTrans?: boolean
}
/**
 * Returns the proper text based on the currently
 * selected locale.
 *
 * @param props
 */
export function tr(props: TrFunctionProps): string {
  if (props.reviewTrans) {
    logger.dev(`Translation: "${props.en}" to "${props.es} requires review"`)
  }
  return getGlobal().locale === 'es' ? props.es : props.en
}

interface TrProps {
  /** English translation */
  en?: React.ReactNode

  /** Spanish translation */
  es?: React.ReactNode

  /** Use this to label if a translation needs to be reviewed */
  reviewTrans?: boolean

  /** <En /> and <Es /> children */
  children?: React.ReactElement<MessageProps>[]
}

export default function Tr(props: TrProps): JSX.Element {
  const locale = useContext(MyI18n)
  let en
  let es

  if (props.children) {
    const children = React.Children.toArray(props.children)
    for (const child of children) {
      if (React.isValidElement(child)) {
        if (child.type === En) en = child
        if (child.type === Es) es = child
      }
    }
  }

  en = en || props.en
  es = es || props.es

  if (!en) {
    throw new Error('English translation missing')
  }

  if (!es) {
    throw new Error('Spanish translation missing')
  }

  if (props.reviewTrans) {
    logger.dev(`Translation: "${en}" to "${es} requires review"`)
  }

  return locale === 'es' && es
    ? <>{es}</>
    : <>{en}</>
}
