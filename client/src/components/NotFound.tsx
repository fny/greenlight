import React from 'react'
import Navigate, { NavigateProps } from './Navigate'

export default function NotFound(props: NavigateProps): JSX.Element {
  return (
    <Navigate {...props} options={{ ...props.options, pushState: false }} />
  )
}
