import React from 'react'

export const SUPPORT_EMAIL = 'help@greenlightready.com'

interface Props {
  email: string
  text?: string
}

export default function EmailLink({ email, text }: Props) {
  return (
    <a href={`mailto:${email}`}>{text || email}</a>
  )
}
