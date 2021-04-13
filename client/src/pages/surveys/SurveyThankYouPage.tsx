import React, { getGlobal } from 'reactn'
import { ReactNComponent } from 'reactn/build/components'
import {
  Page, Navbar, Block, Button, BlockTitle,
} from 'framework7-react'
import { GiphyForToday } from 'src/components/Giphy'
import { NoCurrentUserError } from 'src/helpers/errors'
import { User } from 'src/models'
import { paths } from 'src/config/routes'
import { reasonMessage, reasonTitle } from 'src/i18n/reasons'
import doctorsImage from 'src/assets/images/doctors.svg'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es, tr } from 'src/components/Tr'

export default class SurveyThankYouPage extends ReactNComponent<any, any> {
  currentUser: User

  constructor(props: any) {
    super(props)

    if (!this.global.currentUser) {
      throw new NoCurrentUserError()
    }
    this.currentUser = this.global.currentUser
  }

  anyMissing() {
    return this.currentUser.usersExpectedToSubmit().map((x) => x.greenlightStatus()).some((x) => x.isUnknown())
  }

  allCleared() {
    return this.currentUser.areUsersCleared()
  }

  renderAllCleared() {
    return (
      <Page>
        <Navbar
          title={tr({ en: 'All Clear!', es: '¡Aprobado!' })}
        >
          <NavbarHomeLink slot="left" />
        </Navbar>

        <Block>
          <p>
            <Tr>
              <En>
                Thanks for checking in! Here's something we hope will make you smile. 😃
              </En>
              <Es>
                Gracias por enviar la encuesta. Aquí hay algo que esperamos le haga sonreír. 😃
              </Es>
            </Tr>
          </p>
          <GiphyForToday />
          <Button large fill href={paths.dashboardPath}>
            <Tr en="Back Home" es="Volver al Inicio" />
          </Button>
        </Block>
      </Page>
    )
  }

  renderStatusBreakdownNotSubmitted() {
    // TODO: This needs to be improved
    return (
      <Page>
        <Navbar
          title={tr({ en: 'More to Submit', es: 'Más para enviar' })}
        >
          <NavbarHomeLink slot="left" />
        </Navbar>
        <Block>
          <p style={{ fontWeight: 'bold' }}>
            <Tr>
              <En>You still have more surveys to submit.</En>
              <Es>Aún tienes más encuestas para enviar.</Es>
            </Tr>
          </p>
          <ul>
            {
             this.currentUser.usersExpectedToSubmit().map((u) => (
               <li key={u.id}>
                 {u.fullName()}
                 :
                 {' '}
                 {u.greenlightStatus().title()}
               </li>
             ))
           }
          </ul>
          <br />
          <p>
            <img alt="Doctors" src={doctorsImage} />
          </p>
          <Button large fill href={paths.dashboardPath}>
            <Tr en="Back Home" es="Volver al Inicio" />
          </Button>
        </Block>
      </Page>
    )
  }

  renderStatusBreakdown() {
    return (
      <Page>
        <Navbar
          title={tr({ en: 'Connect to Services', es: 'Conectar a servicios' })}
        >
          <NavbarHomeLink slot="left" />
        </Navbar>
        <Block>
          <p style={{ fontWeight: 'bold' }}>
            <Tr en="Not everyone was cleared." es="No todos estaban permitidos." />
          </p>
          <p>
            <Tr>
              <En>
                Your surveys indicates that someone should stay home and seek attention.
                To schedule an appointment and a test, contact the Duke triage hotline from your home screen.
              </En>

              <Es>Sus encuestas indican que alguien debería quedarse en casa y buscar atención. Para programar una cita y una prueba, comuníquese con la línea directa de triaje de Duke desde su pantalla de inicio.</Es>
            </Tr>
          </p>
          {
            this.currentUser.usersExpectedToSubmit().map((u) => (
              <>
                <p style={{ fontWeight: 'bold' }}>
                  {u.fullName()}
                  :
                  {' '}
                  {u.greenlightStatus().title()}
                </p>

                <p>{reasonMessage(u, this.currentUser)}</p>
              </>
            ))
          }
          <p>
            <img alt="Doctors" src={doctorsImage} />
          </p>
          <Button large fill href={paths.dashboardPath}>
            <Tr en="Back Home" es="Volver al Inicio" />
          </Button>
        </Block>
      </Page>
    )
  }

  renderStatus() {
    const title = reasonTitle(this.currentUser, this.currentUser)
    const message = reasonMessage(this.currentUser, this.currentUser)
    // TODO: This needs to be improved, it looks janky
    return (
      <Page>
        <Navbar
          title={title}
        >
          <NavbarHomeLink slot="left" />
        </Navbar>
        <BlockTitle>
          Status:{' '}
          {this.currentUser.greenlightStatus().title()}
        </BlockTitle>
        <Block>
          <p>
            {message}
          </p>
          <br />
          <p>
            <img alt="Doctors" src={doctorsImage} />
          </p>
          <br />
          <Button large fill href={paths.dashboardPath}>
            <Tr en="Back Home" es="Volver al Inicio" />
          </Button>
        </Block>
      </Page>
    )
  }

  render() {
    if (this.anyMissing()) {
      return this.renderStatusBreakdownNotSubmitted()
    }
    if (this.allCleared()) {
      return this.renderAllCleared()
    }

    if (this.currentUser.hasChildren()) {
      return this.renderStatusBreakdown()
    }
    return this.renderStatus()
  }
}
