import React, { useState } from 'react'
import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, f7, F7Accordion, Link, List, ListInput, ListItem, Page, PageContent, Row, Sheet, Toolbar,
} from 'framework7-react'
import Redirect from 'src/components/Redirect'
import { paths } from 'src/config/routes'
import { GRegisteringLocation, GRegisteringUser } from 'src/initializers/providers'

import { Dict, F7Props } from 'src/types'
import NotFound from 'src/components/NotFound'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { useGlobal } from 'reactn'
import { GLLocales } from 'src/i18n'
import { greeting } from 'src/helpers/util'
import { lcPeople, lcTrans, LocationCategories } from 'src/models/Location'
import { mailHelloAtGreenlight } from 'src/api'

const MESSAGE_IDS = ['school', 'not-durham', 'durham-large', 'durham'] as const
export type RegisterLocationMessageIds = typeof MESSAGE_IDS[number]

function serializeForm(form: HTMLFormElement): Dict<string> {
  const serialized: Dict<string> = {}
  for (let i = 0; i < form.elements.length; i += 1) {
    const el = form.elements[i]
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      serialized[el.name] = el.value
    }
  }
  return serialized
}

function aboutText(location: GRegisteringLocation, user: GRegisteringUser, locale: GLLocales) {
  if (locale === 'en') {
    return `${greeting()}. My name is ${user.firstName} ${user.lastName}. I'm interested in registering my ${location.category} that has about ${location.employeeCount} ${lcPeople(location.category || LocationCategories.COMMUNITY)} in ${location.zipCode}.`
  }
  return `${greeting()}. Mi nombre es ${user.firstName} ${user.lastName}. Me interesa registrar mi ${location.category} que tiene ${location.employeeCount} ${lcPeople(location.category || LocationCategories.COMMUNITY)} en ${location.zipCode}.`
}

function ContactForm() {
  const submitHandler = new SubmitHandler(f7, {
    successMessage: "Thanks! We'll be reaching out to you shortly with more details.",
  })

  const [global] = useGlobal()
  return (
    <List
      form
      noHairlines
      onSubmit={(e) => {
        e.preventDefault()
        const serialized = serializeForm(e.target)
        submitHandler.submit(async () => {
          await mailHelloAtGreenlight(
            serialized.email,
            `[Registration Interest] A new ${global.registeringLocation.category} is interseted`,
            `${serialized.about}\n${serialized.moreAbout}`,
          )
        })
      }}
    >
      <ListInput
        name="email"
        type="email"
        label="Email"
        placeholder="Your email"
        required
        validateOnBlur
        validate
      />
      <ListInput
        name="about"
        type="textarea"
        disabled
        label="About You"
        placeholder="Tell us about how Greenlight can help!"
        value={aboutText(global.registeringLocation, global.registeringUser, global.locale)}
      />

      <ListInput
        name="moreAbout"
        type="textarea"
        label={`More About You and Your ${lcTrans(global.registeringLocation.category || LocationCategories.COMMUNITY)}`}
        placeholder="What else would you like to share?"
      />
      <Button type="submit" fill>
        Send
      </Button>
    </List>
  )
}

function Content({ messageId }: {messageId: RegisterLocationMessageIds}): JSX.Element {
  const [location] = useGlobal('registeringLocation')

  // eslint-disable-next-line default-case
  switch (messageId) {
    case 'school': return (
      <Block>
        <h1>Get In Touch</h1>
        <p>
          We work directly with schools to help get them started.
          What is the best email we can contact you to set up a meeting?
        </p>
        <ContactForm />
      </Block>
    )
    case 'not-durham': return (
      <Block>
        <h1>Get In Touch</h1>
        <ContactForm />
      </Block>
    )
    case 'durham-large': return (
      <Block>
        <h1>Get Started for Free!</h1>
        <p>
          Greenlight is free for your {location.category} thanks to
          to funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
        </p>
        <p>
          Given the size of your {location.category}, we'll need to set up a meeting to get you started.
          Submit the form below, and a member of our staff will reach out to you shortly.
        </p>
        <ContactForm />
      </Block>
    )
    case 'durham': return (
      <Block>
        <h1>Get Started for Free!</h1>
        <p>
          Greenlight is free for your {location.category} thanks to
          to funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
        </p>
        <Button href="" fill>
          Continue
        </Button>
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
