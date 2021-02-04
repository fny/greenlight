import React, { useEffect, useState } from 'react'
import { getLocation, getUser, store } from 'src/api'
import { Location, User } from 'src/models'
import LoadingErrorContent from './LoadingErrorContent'
import LoadingPageContent from './LoadingPageContent'
import NotFoundContent from './NotFoundContent'
import LoadingContent, { LoadingState } from './LoadingContent'
import { useGlobal } from 'reactn'

interface Props {
  userId: string,
  content: (state: LoadingUserState) => JSX.Element
}

export class LoadingUserState extends LoadingState {
  user: User | null = null
}

export default function LoadingUserContent({ userId, content }: Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')

  const [state, setState] = useState({
    ...new LoadingUserState(),
    user: (currentUser?.id === userId)
      ? currentUser
      : store.findEntity<User>(User.uuid(userId)),
    isLoading: !location,
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

  return <LoadingContent state={state} content={content} />
}
