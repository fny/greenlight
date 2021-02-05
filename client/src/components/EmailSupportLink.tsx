import React from 'react'

export const SUPPORT_EMAIL = 'help@greenlightready.com'

interface Props {
  text?: string
}

export default function EmailSupportLink({ text }: Props): JSX.Element {
  return (
    <a href={`mailto:${SUPPORT_EMAIL}`}>{text || SUPPORT_EMAIL}</a>
  )
}
