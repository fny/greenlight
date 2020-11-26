import { Icon, Link } from 'framework7-react'
import React from 'react'
import { dynamicPaths } from 'src/routes'

export default function NavbarHomeLink({ slot }: { slot: 'left' }): JSX.Element {
  return (
    <Link panelOpen="left" slot="left" href={dynamicPaths.currentUserHomePath()}>
      <Icon f7="house" style={{ fontSize: '1em' }} />
    </Link>
  )
}
