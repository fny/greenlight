import React from 'react'
import LoadingErrorContent from './LoadingErrorContent'
import LoadingPageContent from './LoadingPageContent'
import NotFoundContent from './NotFoundContent'

interface Props<T> {
  state: T,
  content: (state: T) => JSX.Element
}

export class LoadedState {
  isLoaded: boolean = false

  error: any = null
}

export default function LoadedContent<T extends LoadedState>(
  { state, content }: Props<T>,
): JSX.Element {
  if (state.isLoaded) {
    return <LoadingPageContent />
  }

  if (state.error) {
    if (state.error.response && state.error.response.status === 404) {
      return <NotFoundContent />
    }
    return <LoadingErrorContent error={state.error} />
  }
  return <>{content(state)}</>
}
