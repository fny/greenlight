import React from 'react'
import LoadingErrorContent from './LoadingErrorContent'
import LoadingPageContent from './LoadingPageContent'
import NotFoundContent from './NotFoundContent'
import Tr from './Tr'

interface Props<T> {
  state: T,
  /** Whether to render errors and loading statuses with full page content */
  showAsPage?: boolean
  /** Whether to show a navbar */
  showNavbar?: boolean
  /** Override to show when loading */
  loading?: (state?: T) => JSX.Element | JSX.Element[]
  /** Override to show when errored */
  errored?: (state?: T) => JSX.Element | JSX.Element[]
  /** Content to show on load */
  content: (state: T) => JSX.Element | JSX.Element[]
}

export class LoadingState {
  isLoading: boolean = true

  error: any = null
}

export default function LoadingContent<T extends LoadingState>(props: Props<T>): JSX.Element {
  if (props.state.isLoading) {
    if (props.loading) return <>{props.loading()}</>
    return props.showAsPage
      ? <LoadingPageContent showNavbar={props.showNavbar} />
      : <Tr en="Loading..." es="Cargando..." />
  }

  if (props.state.error) {
    if (props.errored) return <>{props.errored()}</>

    if (props.showAsPage) {
      if (props.state.error.response && props.state.error.response.status === 404) {
        return <NotFoundContent showNavbar={props.showNavbar} />
      }
      return <LoadingErrorContent error={props.state.error} showNavbar={props.showNavbar} />
    }

    return <Tr en="An error occurred" es="Ocurrió un error" />
  }
  return <>{props.content(props.state)}</>
}
