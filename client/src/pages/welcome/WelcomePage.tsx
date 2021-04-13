/* eslint-disable @typescript-eslint/no-unused-expressions */
import React from 'reactn'

import welcomeImage from 'src/assets/images/illustrations/hello.png'

import {
  Page, Block, Button, Toolbar, Link, Row, Col, Sheet, PageContent,
} from 'framework7-react'

import { Case, When } from 'src/components/Case'

import { esExclaim, greeting } from 'src/helpers/util'
import { User } from 'src/models/User'
import { paths } from 'src/config/routes'
import { ReactNComponent } from 'reactn/build/components'
import { NoCurrentUserError } from 'src/helpers/errors'

import { toggleLocale, signOut } from 'src/helpers/global'
import TermsAndConditionsSheet from 'src/components/TermsAndConditionsSheet'
import { plural } from 'src/i18n'
import Tr, { En, Es } from 'src/components/Tr'

interface State {
  termsOpened: boolean
  currentUser: User
}

export default class WelcomePage extends ReactNComponent<any, State> {
  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.state = {
      termsOpened: false,
      currentUser: this.global.currentUser,
    }
  }

  totalLocations() {
    const user = this.state.currentUser
    return (
      user.locations__HACK().length + user.children.map((x) => x.locations__HACK().length).reduce((x, y) => x + y, 0)
    )
  }

  whoDoYouFillSurveysFor() {
    const user = this.state.currentUser
    const fillForSelf = user.locationAccounts.length > 0
    const fillForChildren = user.children.length > 0
    if (fillForSelf && fillForChildren) {
      return (
        <Tr>
          <En>
            Every day you'll need to check in and fill out symptom surveys for you and your{' '}
            {plural(user.children.length, { one: 'child', other: 'children' })}.
          </En>
          <Es>
            Todos los días deberás completar encuestas de síntomas para usted y {plural(user.children.length, { one: 'su niño', other: 'sus niños' })}.
          </Es>
        </Tr>
      )
    }
    if (fillForSelf) {
      return <Tr en="Every day you'll need to check in and fill out a survey." es="Todos los días deberás completar encuestas de síntomas de ti mismo." />
    }

    if (fillForChildren && !fillForSelf) {
      return (
        <Tr>
          <En>
            Every day you'll need to check in and fill out symptom surveys for your{' '}
            {plural(user.children.length, { one: 'child', other: 'children' })}.
          </En>
          <Es>
            Todos los días deberás completar encuestas de síntomas para {plural(user.children.length, { one: 'su niño', other: 'sus niños' })}.
          </Es>
        </Tr>
      )
    }

    if (!fillForSelf) {
      return (
        <Tr en="Every day you can choose to fill out symptom surveys." es="Todos los días puede optar por completar encuestas de síntomas." />
      )
    }

    return (
      <>
        It looks like your account has not been set up properly. Please contact Greenlight at{' '}
        <Link href="mailto:help@greenlightready.com">help@greenlightready.com</Link>.
      </>
    )
  }

  render() {
    const user = this.state.currentUser
    const locationCount = this.totalLocations()
    return (
      <Page>
        <Block>
          <h1>
            {esExclaim()}
            {greeting()}! &nbsp;&nbsp;&nbsp;&nbsp;
            <Link style={{ fontSize: '12px' }} onClick={() => toggleLocale()}>
              <Tr en="En Español" es="In English" />
            </Link>
          </h1>
          <Case test={locationCount}>
            <When value={0}>
              <p>
                <Tr>
                  <En>Hi {user.firstName}! Welcome to Greenlight's secure COVID-19 monitoring platform.</En>
                  <Es>¡Hola, {user.firstName}! Bienvenido a la plataforma segura de monitoreo COVID-19 de Greenlight.</Es>
                </Tr>
              </p>
            </When>
            <When>
              <p>
                <Tr>
                  <En>
                    Hi {user.firstName}! You're connected to{' '}
                    {plural(this.totalLocations(), { one: '# location', other: '# locations' })} to Greenlight's secure
                    COVID-19 monitoring platform.
                  </En>
                  <Es>
                  ¡Hola, {user.firstName}! Está conectado a la plataforma segura de monitoreo COVID-19 de Greenlight.
                  </Es>
                </Tr>
              </p>
              <p>
                <Tr>
                  <En>
                  {this.whoDoYouFillSurveysFor()} We will not share any data without your permission.
                  </En>
                  <Es>
                  {this.whoDoYouFillSurveysFor()} No compartiremos ningún dato sin tu permiso.
                  </Es>
                </Tr>
              </p>
            </When>
          </Case>

          <img alt="Welcome to Greenlight!" src={welcomeImage} width="100%" />
          <p>
            <Tr>
              <En>
              By continuing, you accept Greenlight's{' '}
              <Link
                onClick={() => {
                  this.setState({ termsOpened: true })
                }}
              >
                {' '}
                Terms and Conditions
              </Link>
              .
              </En>
              <Es>
              Al continuar, acepta los{' '}
              <Link
                onClick={() => {
                  this.setState({ termsOpened: true })
                }}
              >
                {' '}
                Términos y condiciones
              </Link>
              de Greenlight.
              </Es>
            </Tr>
          </p>
        </Block>
        <Block>
          <Row tag="p">
            <Col tag="span">
              <Button large onClick={() => signOut(this.$f7router)}>
                <Tr en="Sign Out" es="Cerrar Session" />
              </Button>
            </Col>
            <Col tag="span">
              <Button large fill href={paths.welcomeReviewPath}>
                <Tr en="Continue" es="Continuar" />
              </Button>
            </Col>
          </Row>
        </Block>

        <TermsAndConditionsSheet
          opened={this.state.termsOpened}
          onClose={() => {
            this.setState({ termsOpened: false })
          }}
        />
      </Page>
    )
  }
}
