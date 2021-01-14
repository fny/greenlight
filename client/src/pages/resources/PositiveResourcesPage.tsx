import { t } from '@lingui/macro'
import {
  Block,
  Link,
  List,
  ListItem,
  Navbar,
  Page,
  Icon,
} from 'framework7-react'
import React from 'react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import quarantineTableImageEn from 'src/assets/images/resources/quarantine-table.png'
import quarantineTableImageEs from 'src/assets/images/resources/quarantine-table-es.png'
import thaoImage from 'src/assets/images/people/thao.jpg'

import './PositiveResourcesPage.css'
import { paths } from 'src/config/routes'
import { useGlobal } from 'reactn'
import { assertNotNull } from 'src/helpers/util'
import Tr, { En, Es, tr } from 'src/components/Tr'

export default function PositiveResourcesPage(): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  return (
    <Page className="PositiveResourcesPage">
      <Navbar title={
        tr({
          en: 'Symptomatic or Positive Case',
          es: 'Caso sintomático o positivo',
        })
      }
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <div className="author-intro-byline">
          <Tr
            en="By Thao Nguyen, 4th Year Medical Student at Duke"
            es="Por Thao Nguyen, estudiante de medicina en Duke"
          />

        </div>
        <div className="author-intro">
          <div className="author-intro-image-wrap">
            <div
              className="author-intro-image"
              style={{
                backgroundImage: `url(${thaoImage})`,
              }}
            />
          </div>
          <div className="author-intro-message">
            <Tr
              en="Although a symptomatic or positive case might seem stressful, the steps are easy to follow."
              es="Aunque un caso sintomático o positivo puede parecer estresante, los pasos son fáciles de seguir."
            />
          </div>
        </div>
        <List>
          {
              currentUser.isInBrevard__HACK() ? (
                <ListItem
                  title={tr({ en: 'Brevard Resources', es: 'Recursos de Brevard' })}
                  footer={tr({ en: 'Find testing sites in Brevard and Connect to the School Nurse', es: 'Encuentre sitios de prueba en Brevard y conéctese con la enfermera de la escuela' })}
                  link={paths.brevardPath}
                >
                  <Icon slot="media" f7="heart" />
                </ListItem>
              ) : (
                <ListItem
                  title={tr({ en: 'Testing at Duke', es: 'Pruebas en Duke' })}
                  footer={
                    tr({
                      en: 'Connect to streamlined testing 8am to 5pm any day',
                      es: 'Conéctese a las pruebas de 8am a 5pm cualquier día',
                    })
                  }
                  link={paths.dukeScheduleTestPath}
                >
                  <Icon slot="media" f7="thermometer" />
                </ListItem>
              )
          }
          <ListItem
            link={paths.testSearchPath}
            title={tr({ en: 'Testing Search', es: 'Buscar pruebas' })}
            footer={tr({ en: 'Search for testing near you', es: 'Busque pruebas cerca de usted' })}
          >
            <Icon slot="media" f7="search" />
          </ListItem>
        </List>

        <Tr>
          <En>
            <p style={{ fontWeight: 'bold' }}>
              Has the suspected or confirmed individual been present 48 hours
              before symptom onset or positive test result?
            </p>

            <p>
              <span>No →</span><br />
              <ul>
                <li>Individual should undergo testing and isolate at home.</li>
                <li>No additional testing or quarantine required for other individuals.</li>
                <li>Spaces used by the individual should be <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/organizations/cleaning-disinfection.html" target="_blank">disinfected per CDC guidance.</a></li>
              </ul>
            </p>

            <p>
              <span>Yes →</span><br />
              <ul>
                <li>Individual should undergo testing and isolate at home</li>
                <li>
                  Identify close contacts (defined as distance &lt;6 feet for &gt;15 minutes). For schools, be sure to include close contacts on buses and during extracurricular activities. Siblings are also considered close contacts.
                </li>
              </ul>
            </p>

            <p style={{ fontWeight: 'bold' }}>Quarantine Protocol</p>
            <p>
              Depending on whether the the individual has symptoms or has had a test,
              the quarantine protocol differs. Use the table below to determine the proper
              course of action.
            </p>
            <p>
              <img src={quarantineTableImageEn} alt="Protocols" width="100%" />
            </p>
          </En>
          <Es>
            <p style={{ fontWeight: 'bold' }}>
              ¿El individuo sospechoso o confirmado ha estado presente durante 48 horas
              antes del inicio de síntomas o resultado positivo de la prueba?
            </p>

            <p>
              <span> No → </span> <br />
              <ul>
                <li> La persona debe ser probado y aislarse en casa. </li>
                <li> No se requieren pruebas adicionales ni cuarentena para otras personas. </li>
                <li> Los espacios utilizados por la persona deben <a href="https://espanol.cdc.gov/coronavirus/2019-ncov/community/disinfecting-building-facility.html" target="_blank"> desinfectarse según los CDC orientación. </a> </li>
              </ul>
            </p>

            <p>
              <span> Sí → </span> <br />
              <ul>
                <li> La persona ser probado y aislarse en casa. </li>
                <li>
                  Identificar contactos cercanos (definidos como distancia &lt;6 pies durante &gt;15 minutos). Para las escuelas, asegúrese de incluir contactos cercanos en los autobuses y durante las actividades extracurriculares. Los hermanos también se consideran contactos cercanos.
                </li>
              </ul>
            </p>

            <p style={{ fontWeight: 'bold' }}> Protocolo de cuarentena </p>
            <p>
              Dependiendo de si el individuo tiene síntomas o ha tenido una prueba,
              el protocolo de cuarentena es diferente. Utilice la tabla a continuación para determinar el
              Curso de acción.
            </p>
            <p>
              <img src={quarantineTableImageEs} alt="Protocolos" width="100%" />
            </p>
          </Es>
        </Tr>

      </Block>
    </Page>
  )
}
