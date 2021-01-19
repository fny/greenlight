import React from 'react'

interface Props {
  email: string
  text?: string
}

export default function EmailLink({ email, text }: Props): JSX.Element {
  return (
    <a href={`mailto:${email}`}>{text || email}</a>
  )
}
