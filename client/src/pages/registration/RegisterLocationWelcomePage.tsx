import { t, Trans } from '@lingui/macro'
import {
  Block, Button, Col, Link, Page, PageContent, Row, Sheet, Toolbar,
} from 'framework7-react'
import React, { useState } from 'react'
import { toggleLocale } from 'src/helpers/global'

import welcomeImage from 'src/assets/images/illustrations/take-a-seat.png'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { F7Props } from 'src/types'
import Redirect from 'src/components/Redirect'

import './RegisterLocationPages.css'
import Tr, { En, Es } from 'src/components/Tr'
import { hasFinishedStepOne } from 'src/models/RegisteringLocation'

export default function RegisterLocationWelcomePage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  const [registeringLocation] = useGlobal('registeringLocation')
  const [state, setState] = useState({ termsOpened: false })

  if (currentUser) {
    return <Redirect to={paths.registerLocationDetailsPath} f7router={props.f7router} />
  }

  return (
    <Page className="RegisterLocationPages">

      <Block>
        <h1>
          <Tr
            en="Welcome!"
            es="¡Bienvenido!"
          />
          <Link style={{ fontSize: '12px', paddingLeft: '1rem' }} onClick={() => toggleLocale()}>
            <Trans id="Common.toggle_locale">En Español</Trans>
          </Link>
        </h1>

        <Tr>
          <En>
            Greenlight provides a suite of COVID-19 monitoring tools to keep
            schools, business, and organizations of different sizes safe, healthy, and opened:
            <ul>
              <li>COVID-19 monitoring</li>
              <li>COVID-19 relief payments</li>
              <li>Guidance from experts in times of crisis</li>
              <li>Social services support</li>
              <li>Testing access</li>
              <li>Vaccine tracking</li>
            </ul>
          </En>
          <Es>
            Greenlight proporciona un conjunto de herramientas de monitoreo COVID-19 para mantener
            escuelas, empresas y organizaciones de diferentes tamaños seguros, saludables y abiertos:
            <ul>
              <li> Monitoreo de COVID-19 </li>
              <li> Pagos de ayuda COVID-19 </li>
              <li> Orientación de expertos en tiempos de crisis </li>
              <li> Soporte de servicios sociales </li>
              <li> Prueba de acceso </li>
              <li> Seguimiento de vacunas </li>
            </ul>
          </Es>
        </Tr>

        <p>
          <Tr>
            <En>
              Greenlight is free or subsidized in many locations! Continue to learn
              more about what's available in your area.
            </En>
            <Es>
              ¡Greenlight es gratis o subsidiado en muchos lugares! Continuar aprendiendo
              más sobre lo que está disponible en su área.
            </Es>
          </Tr>

        </p>
        <div style={{ textAlign: 'center' }}>
          <img alt="Welcome to Greenlight!" src={welcomeImage} height="200px" />
        </div>

        <p>
          <Tr>
            <En>
              By continuing you accept Greenlight's{' '}
              <Link
                onClick={() => {
                  setState({ ...state, termsOpened: true })
                }}
              > Terms and Conditions
              </Link>.
            </En>
            <Es>
              Al continuar, acepta {' '}
              <Link
                onClick={() => {
                  setState({ ...state, termsOpened: true })
                }}
              >los términos y condiciones
              </Link> de Greenlight.
            </Es>
          </Tr>
        </p>
      </Block>
      <Block>
        <Row tag="p">
          <Col tag="span">
            <Button large href={paths.splashPath}>
              <Trans id="Common.back_home">Back Home</Trans>
            </Button>
          </Col>
          <Col tag="span">
            <Button
              large
              fill
              href={paths.registerLocationIntroductionPath}
            >
              <Trans id="Common.continue">Continue</Trans>
            </Button>
          </Col>
        </Row>
      </Block>

      <Sheet
        opened={state.termsOpened}
        onSheetClosed={() => {
          setState({ ...state, termsOpened: false })
        }}
      >
        <Toolbar>
          <div className="left" />
          <div className="right">
            <Link sheetClose><Trans id="Common.close">Close</Trans></Link>
          </div>
        </Toolbar>

        <PageContent> {/*  Use this to make sheet scrollable */}
          <iframe
            title={
              t({ id: 'Common.terms_and_conditions', message: 'Terms and Conditions' })
            }
            src="https://docs.greenlightready.com/terms"
            style={{ width: '100%', border: 0, height: '90%' }}
          />
        </PageContent>
      </Sheet>
    </Page>
  )
}
