import React, { Props } from 'react'
import {
  Block, Button, f7, List, ListInput, Page,
} from 'framework7-react'
import Redirect from 'src/components/Redirect'
import { paths } from 'src/config/routes'
import { RegisteringUser } from 'src/models/RegisteringUser'
import { hasFinishedStepOne, RegisteringLocation } from 'src/models/RegisteringLocation'

import { Dict, F7Props } from 'src/types'
import SubmitHandler from 'src/helpers/SubmitHandler'
import { setGlobal, useGlobal } from 'reactn'
import { GLLocales } from 'src/i18n'
import {
  assertNotNull, greeting, isInDurham, isInOnslow, titleCase,
} from 'src/helpers/util'
import { lcPeople, lcTrans, LocationCategories } from 'src/models/Location'
import { mailHelloAtGreenlight } from 'src/api'

import durhamCityLogo from 'src/assets/images/logos/durham-city-logo.svg'
import durhamCountyLogo from 'src/assets/images/logos/durham-county-logo.svg'
import curamericasLogo from 'src/assets/images/logos/curamericas-logo.svg'

import './RegisterLocationPages.css'
import { Router } from 'framework7/modules/router/router'
import SessionStorage from 'src/helpers/SessionStorage'
import { resetRegistration } from 'src/helpers/global'

const MESSAGE_IDS = [
  'school', 'not-durham', 'durham-large', 'durham', 'curamericas-school',
] as const

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

function aboutText(location: RegisteringLocation, user: RegisteringUser, locale: GLLocales) {
  if (locale === 'en') {
    return `${greeting()}, Greenlight! My name is ${user.firstName} ${user.lastName}. I'm interested in registering my ${location.category} that has about ${location.employeeCount} ${lcPeople(location.category || LocationCategories.COMMUNITY)}.`
  }
  return `¡${greeting()}, Greenlight! Mi nombre es ${user.firstName} ${user.lastName}. Me interesa registrar mi ${location.category} que tiene ${location.employeeCount} ${lcPeople(location.category || LocationCategories.COMMUNITY)}.`
}

function ContactForm({ f7router }: { f7router: Router.Router }) {
  const submitHandler = new SubmitHandler(f7, {
    successMessage: "Thanks! We'll be reaching out to you shortly with more details.",
    onSuccess: () => {
      f7router.navigate(paths.rootPath)
      resetRegistration()
    },
  })

  const [global] = useGlobal()

  return (
    <List
      form
      style={{ marginTop: '0' }}
      noHairlines
      onSubmit={(e) => {
        e.preventDefault()
        const serialized = serializeForm(e.target)
        submitHandler.submit(async () => {
          await mailHelloAtGreenlight(
            `[Registration Interest] A new ${global.registeringLocation.category} is interested.`,
            `${aboutText(global.registeringLocation, global.registeringUser, global.locale)} ${serialized.moreAbout || ''}\n\n${JSON.stringify(global.registeringUser, null, 2)}\n\n${JSON.stringify(global.registeringLocation, null, 2)}`,
          )
        })
      }}
    >
      <p style={{ fontWeight: 'bold' }}>Your Message</p>
      {/* <ListInput
        name="about"
        type="textarea"
        readonly
        value={aboutText(global.registeringLocation, global.registeringUser, global.locale)}
        style={{ lineHeight: '5em', overflow: 'hidden' }}
      /> */}

      <p>{aboutText(global.registeringLocation, global.registeringUser, global.locale)}</p>

      <ListInput
        name="moreAbout"
        type="textarea"
        placeholder="What else would you like to share?"
      />
      <br />
      <Button type="submit" fill>
        Send Message
      </Button>
    </List>
  )
}

function Content({ messageId, f7router }: {messageId: RegisterLocationMessageIds, f7router: Router.Router }): JSX.Element {
  const [location] = useGlobal('registeringLocation')
  const [currentUser] = useGlobal('currentUser')

  // eslint-disable-next-line default-case
  switch (messageId) {
    case 'not-durham': return (
      <Block>
        <h1>Get In Touch</h1>
        <p>
          Almost done! Due to your location, we'll need to get in touch to finalize your onboarding with us.
        </p>
        <ContactForm f7router={f7router} />
      </Block>
    )
    case 'school': return (
      <Block>
        <h1>Get In Touch</h1>
        <p>
          We work directly with schools to help get them started.
          Send us a note, and we'll set up a time to meet!
        </p>
        <ContactForm f7router={f7router} />
      </Block>
    )
    case 'curamericas-school': return (
      <Block>
        <h1>Get In Touch</h1>
        <p>
          Greenlight is free for your school thanks to
          to funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
        </p>
        <div className="logos">
          <img alt="Duhram City" src={durhamCityLogo} className="logo" />
          <img alt="Curamericas" src={curamericasLogo} className="logo" />
          <img alt="Durham County" src={durhamCountyLogo} className="logo" />
        </div>
        <p>
          We work directly with schools to help get them started. Send us a note
          and we'll set up a time to meet!
        </p>
        <ContactForm f7router={f7router} />
      </Block>
    )
    case 'durham-large': return (
      <Block>
        <h1>Get Started for Free!</h1>
        <p>
          Greenlight is free for your {location.category} thanks to
          to funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
        </p>
        <div className="logos">
          <img alt="Duhram City" src={durhamCityLogo} className="logo" />
          <img alt="Curamericas" src={curamericasLogo} className="logo" />
          <img alt="Durham County" src={durhamCountyLogo} className="logo" />
        </div>
        <p>
          Given the size of your {location.category}, we'll need to set up a meeting to get you started.
          Submit the form below, and a member of our staff will reach out to you shortly.
        </p>
        <ContactForm f7router={f7router} />
      </Block>
    )
    case 'durham': return (
      <Block>
        <h1>Get Started for Free!</h1>
        <p>
          Greenlight is free for your {location.category} thanks to
          to funding from the NC DHHS, Durham City and County, and our partner Curamericas Global.
        </p>

        <div className="logos">
          <img alt="Duhram City" src={durhamCityLogo} className="logo" />
          <img alt="Curamericas" src={curamericasLogo} className="logo" />
          <img alt="Durham County" src={durhamCountyLogo} className="logo" />
        </div>
        <Button
          href={
            currentUser ? paths.registerLocationDetailsPath : paths.registerLocationOwnerPath
          }
          fill
        >
          Continue
        </Button>
      </Block>
    )
    default: return (
      <></>
    )
  }
}

/**
 * Returns the id of the message that should be shown on the next page based
 * on the zip code of the location and the category.
 *
 * @param location the registering location
 */
function messageFor(location: RegisteringLocation): RegisterLocationMessageIds {
  assertNotNull(location.zipCode)
  assertNotNull(location.category)
  assertNotNull(location.employeeCount)

  // Schools in Durham must contact us
  if (location.category === LocationCategories.SCHOOL && (isInDurham(location.zipCode) || isInOnslow(location.zipCode))) {
    return 'curamericas-school'
  }

  // Schools must contact us
  if (location.category === LocationCategories.SCHOOL) {
    return 'school'
  }

  // Outside of durham must contact us
  if (!isInDurham(location.zipCode)) {
    return 'not-durham'
  }

  // Large locations get onboarding time for now
  if ((location.employeeCount || 0) > 100) {
    return 'durham-large'
  }

  return 'durham'
}

export default function RegisterLocationMessagePage(props: F7Props): JSX.Element {
  const [registeringLocation] = useGlobal('registeringLocation')

  if (!hasFinishedStepOne(registeringLocation)) {
    return <Redirect to={paths.splashPath} f7router={props.f7router} />
  }

  const messageId = messageFor(registeringLocation)
  return (
    <Page className="RegisterLocationPages">
      <Content messageId={messageId} f7router={props.f7router} />
    </Page>
  )
}
