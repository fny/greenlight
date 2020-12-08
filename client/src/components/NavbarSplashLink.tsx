import React from 'react'
import { paths } from 'src/routes'

export default function NavbarSplashLink({ slot }: { slot: 'left'}): JSX.Element {
  return (
    <a className="icon-only back link" href={paths.splashPath} slot={slot}>
      <i className="icon icon-back" />
    </a>
  )
}
