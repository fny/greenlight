import React from 'react'
import Navigate, { NavigateProps } from './Navigate'

export default function Redirect(props: NavigateProps): JSX.Element {
  return (
    <Navigate {...props} options={{ ...props.options, reloadCurrent: true }} />
  )
}
