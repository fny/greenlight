import React, { useContext } from 'react'
import { getGlobal } from 'reactn'
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

  /**
   * Use this to label if a translation needs to be reviewed.
   * IMPORTANT: This name should always be easy to grep.
  */
  reviewTrans?: boolean
}
/**
 * A function which returns the proper text based on the current locale.
 *
 * @example Renders the appropriate text based on the locale
 * tr({ en: 'Hello',  es: 'Hola' })
 *
 * @example Translation marked for review
 * tr({ en: 'Hello',  es: 'Hola', reviewTrans })
 *
 * @param props
 */
export function tr(props: TrFunctionProps): string {
  if (props.reviewTrans) {
    logger.dev(`Translation: "${props.en}" to "${props.es} requires review"`)
  }
  if (!props.en) {
    throw new Error('English translation missing')
  }

  if (!props.es) {
    throw new Error('Spanish translation missing')
  }
  return getGlobal().locale === 'es' ? props.es : props.en
}

interface TrProps {
  /** English content */
  en?: React.ReactNode

  /** Spanish content */
  es?: React.ReactNode

  /**
   * Use this to label if a translation needs to be reviewed.
   * IMPORTANT: This name should always be easy to grep.
  */
  reviewTrans?: boolean

  /** <En /> and <Es /> children */
  children?: React.ReactElement<MessageProps>[]
}

/**
 * A component which renders the proper text based on the current locale.
 * Comes in two flavors.
 *
 * WARNING: It might be tempting to combine this with `tr`, but beware the input
 * types are different. Yes, there is common functionality, but its simpler to
 * leave these as separate functions.
 *
 * @example Nested components
 * <Tr>
 *   <En>Hello</En>
 *   <Es>Hola</Es>
 * </Tr>
 *
 * @example Single component
 * <Tr en="Hello" es="Hola" />
 *
 * @example Translation marked for review
 * <Tr en="Hello" es="Hola" reviewTrans />
 *
 * @throws When english or spanish isn't provided through one of the two
 * flavors above.
 *
 * @param props
 */
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
