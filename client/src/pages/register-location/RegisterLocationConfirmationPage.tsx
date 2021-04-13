import {
  Block, Button, Link, Page,
} from 'framework7-react'
import React, { useEffect, useState } from 'react'

import { paths } from 'src/config/routes'
import { F7Props } from 'src/types'
import { getLocation, store } from 'src/api'
import { assertNotNull, assertNotUndefined, upperCaseFirst } from 'src/helpers/util'
import { Location } from 'src/models'
import LoadingContent, { LoadingState } from 'src/components/LoadingContent'
import EmailSupportLink from 'src/components/EmailSupportLink'
import Tr, { En, Es } from 'src/components/Tr'
import { lcTrans } from 'src/models/Location'

class State extends LoadingState {
  location: Location | null = null
}

export default function RegisterLocationConfirmationPage(props: F7Props): JSX.Element {
  const { locationId } = props.f7route.params
  assertNotUndefined(locationId)

  const location = store.findEntity<Location>(Location.uuid(locationId))
  const [state, setState] = useState<State>({
    ...new State(),
    isLoading: !location,
    location,
  })

  useEffect(() => {
    if (state.location) return
    getLocation(locationId)
      .then((location) => {
        setState({ ...state, location, isLoading: false })
      })
      .catch((error) => {
        setState({ ...state, error, isLoading: false })
      })
  }, [locationId])

  return (
    <Page className="RegisterLocationWelcomePage">
      <LoadingContent
        showNavbar
        showAsPage
        state={state}
        content={(state) => {
          const { location } = state
          assertNotNull(location)
          return (
            <>
              <style>
                {
                    `
                    .RegisterLocationWelcomePage .fill-in-the-blank {
                      display: inline-block;
                      border-bottom: 1px dashed black;
                      text-align: center;
                      color: var(--gl-green);
                    }
                    .RegisterLocationWelcomePage .category-select {
                      cursor: pointer;
                    }
                    .RegisterLocationWelcomePage .introduction {
                      font-size: 1.5rem;
                    }
                    .RegisterLocationWelcomePage .has-error {
                      color: red;
                      border-bottom: 1px dashed red;
                    }
                    .RegisterLocationWelcomePage .has-error::placeholder {
                      color: red;
                    }
                    `
                  }
              </style>
              <Block>
                <h1>
                  <Tr
                    en={`Your ${upperCaseFirst(lcTrans(location.category))} Has Been Registered`}
                    es={`Se ha creado su ${lcTrans(location.category)}`}
                  />
                </h1>
                <p>
                  <Tr
                    en="Your employees can now create their accounts by visiting the following link:"
                    es="Ahora sus empleados pueden crear sus cuentas visitando el siguiente enlace:"
                  />
                </p>
                <p style={{ fontWeight: 'bold' }}>{location.registrationWithCodeURL()}</p>
                <p>
                  <Tr>
                    <En>
                      They can also sign up by visiting the app,
                      clicking create account, and signing in with the following location id
                      and registration code:
                    </En>
                    <Es>
                      También pueden registrarse visitando la aplicación, haciendo clic
                      en "crear cuenta" e iniciando sesión con la siguiente
                      identificación de ubicación y código de registro:
                    </Es>
                  </Tr>
                </p>
                <ul>
                  <li>
                    <Tr
                      en={`Your ID: ${location.permalink}`}
                      es={`Su ID: ${location.permalink}`}
                    />
                  </li>
                  <li>
                    <Tr
                      en={`Registration Code: ${location.registrationCode} (case insensitive)`}
                      es={`Código de registro: ${location.registrationCode} (no distingue entre mayúsculas y minúsculas))`}
                    />
                  </li>
                </ul>
                <p>
                  <Tr>
                    <En>
                      You will also receive an email with these instructions.
                      If you have any questions, feel free to email us at
                    </En>
                    <Es>
                      También recibirá un correo electrónico con estas instrucciones.
                      Si tiene alguna pregunta, enviarnos un correo electrónico a
                    </Es>
                  </Tr>
                  {' '}
                  <EmailSupportLink />
                </p>

                <Button fill href={paths.welcomeSurveyPath}>
                  <Tr
                    en="Learn About Surveys"
                    es="Más información sobre las encuestas"
                  />
                </Button>
              </Block>
            </>
          )
        }}
      />
    </Page>
  )
}
