import React, { useState } from 'react'
import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, f7, F7Accordion, Link, List, ListInput, ListItem, Page, PageContent, Row, Sheet, Toolbar,
} from 'framework7-react'
import Redirect from 'src/components/Redirect'
import { paths } from 'src/config/routes'
import { GRegisteringLocation } from 'src/initializers/providers'

import { F7Props } from 'src/types'
import NotFound from 'src/components/NotFound'
import SubmitHandler from 'src/helpers/SubmitHandler'

const MESSAGE_IDS = ['school', 'not-durham', 'durham-large', 'durham'] as const
export type RegisterLocationMessageIds = typeof MESSAGE_IDS[number]

function Content({ messageId }: {messageId: RegisterLocationMessageIds}): JSX.Element {
  const [email, setEmail] = useState('')

  const submitHandler = new SubmitHandler(f7, {
    successMessage: "Thanks! We'll be reaching out to you shortly with more details.",
    onSubmit: () => {
      submitHandler
    },
  })

  // eslint-disable-next-line default-case
  switch (messageId) {
    case 'school': return (
      <Block>
        <h1>Get In Touch</h1>
        <p>
          We work directly with schools to help get them started.
          What is the best email we can contact you at?
        </p>
        <List form noHairlines>
          <ListInput
            type="email"
            label="Email"
            placeholder="Your email"
            required
            validateOnBlur
            validate
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <Button type="submit" fill>
            Send
          </Button>
        </List>
      </Block>
    )
    case 'not-durham': return (
      <Block>
        <h1>Get In Touch</h1>
      </Block>
    )
    case 'durham-large': return (
      <Block>
        <h1>Get In Touch</h1>
      </Block>
    )
    case 'durham': return (
      <Block>
        <h1>
          Free Registration
        </h1>
      </Block>
    )
  }
}

export default function RegisterLocationMessagePage(props: F7Props): JSX.Element {
  const { messageId } = props.f7route.params
  if (!MESSAGE_IDS.includes(messageId as any)) {
    return <NotFound to={paths.notFoundPath} router={props.f7router} />
  }

  return (
    <Page className="RegisterLocationMessagePage">
      <Content messageId={messageId as RegisterLocationMessageIds} />
    </Page>
  )
}
