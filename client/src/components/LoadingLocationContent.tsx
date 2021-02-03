import React, { useEffect, useState } from 'react'
import { getLocation, store } from 'src/api'
import { Location } from 'src/models'
import LoadingContent, { LoadingState } from './LoadingContent'

interface Props {
  locationId: string
  content: (state: LoadingLocationState) => JSX.Element
}

export class LoadingLocationState extends LoadingState {
  location: Location | null = null
}

export default function LoadingLocationContent({ locationId, content }: Props): JSX.Element {
  const location = store.findEntity<Location>(Location.uuid(locationId))
  const [state, setState] = useState({
    ...new LoadingLocationState(),
    location,
    isLoading: !location,
  })

  useEffect(() => {
    if (state.location) return
    getLocation(locationId)
      .then((location) => {
        setState({ ...state, location, isLoading: false })
      })
      .catch((error) => {
        setState({ ...state, error, isLoading: false })
      })
  }, [locationId])

  return <LoadingContent state={state} content={content} />
}
