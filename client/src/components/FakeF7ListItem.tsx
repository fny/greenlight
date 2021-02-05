import React from 'react'

/**
 * A fragment that's disguised as an F7ListItem. Use this to trick Framework7
 * into thinking that list items that are not directly nested under an F7List
 * actually are. Fixes some styling bugs.
 *
 * @param props you can pass children along.
 */
export default function FakeF7ListItem(props: { children: React.ReactNode }): JSX.Element {
  return <>{props.children}</>
}

FakeF7ListItem.displayName = 'F7ListItem'
