import React from 'react'
import LoadingErrorContent from './LoadingErrorContent'
import LoadingPageContent from './LoadingPageContent'
import NotFoundContent from './NotFoundContent'

interface Props<T> {
  state: T,
  hideNavbar?: boolean
  content: (state: T) => JSX.Element
}

export class LoadingState {
  isLoading: boolean = true

  error: any = null
}

export default function LoadingContent<T extends LoadingState>(
  { state, content, hideNavbar }: Props<T>,
): JSX.Element {
  if (state.isLoading) {
    return <LoadingPageContent hideNavbar={hideNavbar} />
  }

  if (state.error) {
    if (state.error.response && state.error.response.status === 404) {
      return <NotFoundContent hideNavbar={hideNavbar} />
    }
    return <LoadingErrorContent error={state.error} hideNavbar={hideNavbar} />
  }
  return <>{content(state)}</>
}
