import React, { useEffect, useState } from 'react'
import { getUser, store } from 'src/api'
import { User } from 'src/models'
import { useGlobal } from 'reactn'
import LoadingContent, { LoadingState } from './LoadingContent'

interface Props {
  userId: string,
  content: (state: LoadingUserState) => JSX.Element
  /** Whether to render errors and loading statuses with full page content */
  showAsPage?: boolean
  /** Whether to show a navbar */
  showNavbar?: boolean
  /** Override to show when loading */
  loading?: (state?: LoadingUserState) => JSX.Element
  /** Override to show when errored */
  errored?: (state?: LoadingUserState) => JSX.Element
}

export class LoadingUserState extends LoadingState {
  user: User | null = null
}

export default function LoadingUserContent({
  userId, content, showNavbar, showAsPage, loading, errored,
}: Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  const user = (currentUser?.id === userId) ? currentUser : store.findEntity<User>(User.uuid(userId))
  const [state, setState] = useState({
    ...new LoadingUserState(),
    user,
    isLoading: !user,
  })

  useEffect(() => {
    if (state.user) return
    getUser(userId)
      .then((user) => {
        setState({ ...state, user, isLoading: false })
      })
      .catch((error) => {
        setState({ ...state, error, isLoading: false })
      })
  }, [userId])

  return (
    <LoadingContent
      state={state}
      content={content}
      showNavbar={showNavbar}
      showAsPage={showAsPage}
      loading={loading}
      errored={errored}
    />
  )
}
