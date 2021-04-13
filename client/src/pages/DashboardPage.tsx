import React, { useGlobal } from 'reactn'
import {
  AccordionContent,
  Page,
  List,
  ListItem,
  Navbar,
  Link,
  BlockTitle,
  NavTitle,
  NavRight,
  Icon,
} from 'framework7-react'
import { esExclaim, greeting } from 'src/helpers/util'
import If from 'src/components/If'
import { dynamicPaths, paths } from 'src/config/routes'
import colors from 'src/config/colors'
import { User } from 'src/models'

import ReleaseCard from 'src/components/ReleaseCard'
import { F7Props } from 'src/types'
import Redirect from 'src/components/Redirect'
import Tr, { En, Es, tr } from 'src/components/Tr'
import UserJDenticon from '../components/UserJDenticon'

function UserList({ users }: { users: User[] }) {
  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id} accordionItem link="#" title={user.firstName} after={user.greenlightStatus().title()}>
          <div slot="media">
            <UserJDenticon user={user} size={29} />
          </div>
          <AccordionContent>
            <List>
              {/* <ListItem
            link={`/users/${user.id}/covid-test`}
            title="Submit COVID Test"
          ></ListItem> */}
              <ListItem
                link={dynamicPaths.userGreenlightPassPath(user.id)}
                title={tr({en: 'Greenlight Pass', es: 'Pase Greenlight' })}
              />
              <If test={user.hasNotSubmittedOwnSurvey()}>
                <ListItem
                  link={dynamicPaths.userSurveysNewPath(user.id, { single: true })}
                  title={tr({en: 'Check In', es: 'Enviar Encuesta' })}
                />
              </If>
              <If test={user.hasSubmittedOwnSurvey()}>
                <ListItem
                  link={dynamicPaths.userSurveysNewPath(user.id, { single: true, resubmit: true })}
                  title={tr({en: 'Resubmit Survey', es: 'Cambiar Encuesta' })}
                />
              </If>
              {/* <ListItem
            link={`/users/${user.id}/absence`}
            title="Schedule Absence"
          ></ListItem> */}
              {/* <ListItem
            link={`/users/${user.id}/locations`}
            title="Locations"
          ></ListItem> */}
            </List>
          </AccordionContent>
        </ListItem>
      ))}
    </List>
  )
}

export default function DashboardPage(props: F7Props): JSX.Element {
  const [currentUser] = useGlobal('currentUser')

  if (!currentUser) {
    return <Redirect to={paths.rootPath} f7router={props.f7router} />
  }

  return (
    <Page>
      <Navbar>
        <NavTitle>Greenlight</NavTitle>
        <NavRight>
          <Link href={paths.settingsPath}>
            <Icon f7="person_circle" />
          </Link>
        </NavRight>
      </Navbar>

      <BlockTitle>
        <b>
          {esExclaim()}{greeting()}, {currentUser.firstName}!
        </b>
      </BlockTitle>

      <If test={currentUser.showSubmissionPanelForToday()}>
        <Link href={paths.userSeqSurveysNewPath}>
          <div className="GLCard">
            <div className="GLCard-title">
              <Tr es="Enviar encuesta diaria" en="Submit Daily Check-In" />
            </div>
            <div className="GLCard-body" style={{ color: colors.greenDark }}>
              <Tr>
                <En>
                  How are you today? You still need to check in {currentUser.usersNotSubmittedText()}.
                </En>
                <Es>
                  ¿Cómo está hoy? Necesita completar encuestas para {currentUser.usersNotSubmittedText()}.
                </Es>
              </Tr>
            </div>
            <div className="GLCard-action">
              <div className="GLCard-action">
                <div style={{ width: '80%', display: 'inline-block' }}>
                  <Tr en="Go to Check-In" es="Ir a Enquesta" />
                </div>
                <div
                  style={{
                    width: '20%',
                    display: 'inline-block',
                    textAlign: 'right',
                  }}
                >
                  <Icon f7="arrow_right" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </If>

      <If test={currentUser.showSubmissionPanelForTomorrow()}>
        <Link href={paths.userSeqSurveysNewPath}>
          <div className="GLCard">
            <div className="GLCard-title">
            <Tr es="Enviar encuesta diaria" en="Submit Daily Check-In" />
            </div>
            <div className="GLCard-body" style={{ color: colors.greenDark }}>
              <Tr>
                <En>
                  Get ready for tomorrow! You need to check in {currentUser.usersNotSubmittedForTomorrowText()}.
                </En>
                <Es>
                  Prepárase para mañana. Debe completar encuestas para {currentUser.usersNotSubmittedForTomorrowText()}.
                </Es>
              </Tr>
            </div>
            <div className="GLCard-action">
              <div className="GLCard-action">
                <div style={{ width: '50%', display: 'inline-block' }}>
                  <Tr en="Go to Check-In" es="Ir a Enquesta" />
                </div>
                <div
                  style={{
                    width: '50%',
                    display: 'inline-block',
                    textAlign: 'right',
                  }}
                >
                  <Icon f7="arrow_right" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </If>

      <ReleaseCard />

      <If test={!currentUser.hasChildren()}>
        <BlockTitle>
          <Tr en="Your Status" es="Su Estatus" />
        </BlockTitle>
        <UserList users={[currentUser]} />
      </If>

      <If test={currentUser.hasChildren()}>
        <BlockTitle>
          {/* User is a worker and has children */}
          {currentUser.hasLocationThatRequiresSurvey() && currentUser.isParent()
              && <Tr en="Your Family" es="Su Familia" />}
          {/* User is only a parent */}
          {!currentUser.hasLocationThatRequiresSurvey() && currentUser.isParent() && <Tr en="Your Children" es="Sus Hijos" />}
          {/* User is not a parent */}
          {!currentUser.isParent() && <Tr en="Your Status" es="Su Estado" />}
        </BlockTitle>
        <UserList users={currentUser.usersExpectedToSubmit()} />
      </If>
      <BlockTitle>
        <Tr en="Resources For You" es="Rescursos" />
      </BlockTitle>
      <List>
        {
            currentUser.isAdminSomewhere()
            && (
            <ListItem
              accordionItem
              title="Admin"
            >
              <Icon slot="media" f7="helm" />
              <AccordionContent>
                <List>
                  {
                    currentUser.adminLocations().map((location) => (
                      <ListItem
                        key={location.id}
                        link={dynamicPaths.adminDashboardPath({ locationId: location.id })}
                        title={location.name || ''}
                      />
                    ))
                  }
                </List>
              </AccordionContent>
            </ListItem>
            )
          }

        <ListItem
          title={tr({ en: "Help! I'm Symptomatic or Positive", es: '¡Ayuda! Estoy Sintomático o Positivo' })}
          footer={tr({ en: 'Resources for when someone has symptoms or COVID', es: 'Recursos para cuando alguien tiene síntomas o COVID' })}
          link={paths.positiveResourcesPath}
        >
          <Icon slot="media" f7="exclamationmark_triangle" />
        </ListItem>
        <ListItem
          link={paths.chwRequestPath}
          title={tr({ en: 'Connect to Services', es: 'Conectarse a los servicios' })}
          footer={tr({
            en: 'Send a request to a community health worker for help with healthcare, housing, legal services, COVID-19 supplies and more.',
            es: 'Envíe una solicitud a un trabajador de salud de la comunidad para que le ayude con la atención médica, la vivienda, los servicios legales, los suministros de COVID-19 y más.',
          })}
        >
          <Icon slot="media" f7="heart" />
        </ListItem>
        <ListItem
          link={paths.mentalHealthPath}
          title={tr({ en: 'Mental Health Support', es: 'Salud Mental' })}
          footer={tr({
            en: 'Connect with Hope4NC for free and confidential help with any issues you have',
            es: 'Conéctese con Hope4NC para obtener ayuda gratuita y confidencial con cualquier problema que tenga',
          })}
        >
          <Icon slot="media" f7="sun_haze" />
        </ListItem>
        <ListItem
          title={
            tr({ en: 'All Resources', es: 'Todos los recursos' })
          }
          footer={
            tr({
              en: 'More information, search for testing',
              es: 'Más información, buscar pruebas',
            })
          }
          accordionItem
        >
          <Icon slot="media" f7="compass" />
          <AccordionContent>
            <List>
              <ListItem
                link={paths.testSearchPath}
                title={tr({en: 'Find Testing', es: 'Buscar Pruebas' })}
                footer={tr({en: 'Testing Sites Near You', es: 'Prueba de sitios cercanos' })}
              >
                <Icon slot="media" f7="search" />
              </ListItem>
              {!currentUser.isInBrevard__HACK() && (
                <ListItem
                  title={tr({en: 'Testing at Duke', es: 'Pruebas de Duke' })}
                  footer={tr({en: 'Connect to streamlined testing 8am to 5pm any day', es: 'Conéctese a pruebas rápidas de 8am a 5pm cualquier día' })}
                  link={paths.dukeScheduleTestPath}
                >
                  <Icon slot="media" f7="thermometer" />
                </ListItem>
              )}
              {
            currentUser.isInBrevard__HACK() && (
              <ListItem
                title="Brevard Resources"
                footer="Find testing sites in Brevard and Connect to the School Nurse"
                link={paths.brevardPath}
              >
                <Icon slot="media" f7="heart" />
              </ListItem>
            )
          }
              {/* https://ncchildcare.ncdhhs.gov/Portals/0/documents/pdf/P/Parent_and_Families_School_Age_Child_Care.pdf?ver=2020-08-26-122445-963 */}
              <ListItem
                external
                link="tel:1-888-600-1685"
                title={tr({en: 'Child Care Hotline', es: 'Cuidado Infantil' })}
                footer={tr({
                  en: 'Child care referrals available 8am-5pm Monday-Friday',
                  es: 'Referencias de cuidado infantil de 8am a 5pm lunes a viernes'
                })}
              >
                <Icon slot="media" f7="phone" />
              </ListItem>

              {/* https://www.communitycarenc.org/what-we-do/supporting-primary-care */}
              <ListItem
                external
                link="tel:1-877-490-6642"
                title={tr({en: 'Contact NC COVID-19 Triage Hotline', es: 'Llama a la ayuda de COVID-19' })}
                footer={tr({en: 'Call 7am-11pm any day', es: 'Llama de 7:00 a 23:00 cualquier día' })}
              >
                <Icon slot="media" f7="phone" />
              </ListItem>
            </List>
          </AccordionContent>
        </ListItem>
        <ListItem
          link={paths.supportPath}
          title={tr({en: 'FAQs and Support', es: 'Ayuda' })}
          footer={tr({en: 'Contact Greenlight support directly', es: 'Conectese a Greenlight' })}
        >
          <Icon slot="media" f7="chat_bubble_2" />
        </ListItem>

        {/* <ListItem
          title="Special PPE Pricing"
          footer="Low prices on personal protective equipment from Supply Hawk"
        >
          <Icon slot="media" f7="shield" />
        </ListItem> */}

        {/* <ListItem
            link={paths.ncStatewideStatsPath}
            // link="tel:1-877-490-6642"
            title={tr({en: 'NC COVID-19 Data', es: '' })}
            footer={tr({en: 'COVID-19 maps and statistics from across the state', es: '' })}
          >
            <Icon slot="media" f7="graph_square" />
          </ListItem> */}

      </List>
    </Page>
  )
}
