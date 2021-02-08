import React, { useEffect, useState } from 'react'
import LoadingContent, { LoadingState } from './LoadingContent'

interface Props<T> {
  action: () => Promise<T>
  content: (state: LoadingBundleState<T>) => JSX.Element | JSX.Element[]
  /** Whether to render errors and loading statuses with full page content */
  showAsPage?: boolean
  /** Whether to show a navbar */
  showNavbar?: boolean
  /** Override to show when loading */
  loading?: (state?: LoadingBundleState<T>) => JSX.Element | JSX.Element[]
  /** Override to show when errored */
  errored?: (state?: LoadingBundleState<T>) => JSX.Element | JSX.Element[]

}

export class LoadingBundleState<T> extends LoadingState {
  bundle: T | null = null
}

export default function LoadingBundleContent<T>({
  action, content, showNavbar, loading, errored,
}: Props<T>): JSX.Element {
  const [state, setState] = useState({
    ...new LoadingBundleState<T>(),
  })

  useEffect(() => {
    if (state.bundle) return
    action()
      .then((bundle) => {
        setState({ ...state, bundle, isLoading: false })
      })
      .catch((error) => {
        setState({ ...state, error, isLoading: false })
      })
  }, [])

  return <LoadingContent state={state} content={content} loading={loading} errored={errored} showNavbar={showNavbar} />
}
