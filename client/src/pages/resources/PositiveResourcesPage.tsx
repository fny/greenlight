import {
  Block,
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

            <span>No →</span><br />
            <ul>
              <li>Individual should undergo testing and isolate at home.</li>
              <li>No additional testing or quarantine required for other individuals.</li>
              <li>Spaces used by the individual should be disinfected <a href="https://www.cdc.gov/coronavirus/2019-ncov/community/organizations/cleaning-disinfection.html" rel="noreferrer" target="_blank">per CDC guidance.</a></li>
            </ul>

            <span>Yes →</span><br />
            <ul>
              <li>Individual should undergo testing and isolate at home</li>
              <li>
                Identify close contacts (defined as distance &lt;6 feet for &gt;15 minutes). For schools, be sure to include close contacts on buses and during extracurricular activities. Siblings are also considered close contacts.
              </li>
            </ul>

            <p>
              <span style={{ fontWeight: 'bold' }}>Table for individuals with symptoms, positive test, or close contact</span>
              <img src={quarantineTableImageEn} alt="Protocols" width="100%" />
            </p>
            <p className="caution">
              *Some counties may be implementing the CDC’s <a href="https://www.cdc.gov/coronavirus/2019-ncov/more/scientific-brief-options-to-reduce-quarantine.html" rel="noreferrer" target="_blank">new guidelines</a> for reducing quarantine. 
              However, because those guidelines vary county-by-county, Greenlight will be implementing the full 14-day quarantine policy to ensure that our communities remain as safe as possible.
              If guidelines from your organization differ from ours, please follow your organization’s guidelines.
            </p>
          </En>
          <Es>
            <p style={{ fontWeight: 'bold' }}>
              ¿El individuo sospechoso o confirmado ha estado presente durante 48 horas 
              antes del inicio de síntomas o resultado positivo de la prueba?
            </p>

            <span> No → </span> <br />
            <ul>
              <li> La persona debe ser probado y aislarse en casa. </li>
              <li> No se requieren pruebas adicionales ni cuarentena para otras personas. </li>
              <li> Los espacios utilizados por la persona deben <a href="https://espanol.cdc.gov/coronavirus/2019-ncov/community/disinfecting-building-facility.html" rel="noreferrer" target="_blank">desinfectarse según los CDC orientación.</a> </li>
            </ul>

            <span> Sí → </span> <br />
            <ul>
              <li> La persona ser probado y aislarse en casa. </li>
              <li>
                Identificar contactos cercanos (definidos como distancia &lt;6 pies durante &gt;15 minutos). Para las escuelas, asegúrese de incluir contactos cercanos en los autobuses y durante las actividades extracurriculares. Los hermanos también se consideran contactos cercanos.
              </li>
            </ul>

            <p>
              <span style={{ fontWeight: 'bold' }}>Mesa para personas con síntomas, prueba positiva, o contacto cercano con una persona COVID positiva</span>
              <img src={quarantineTableImageEs} alt="Protocolos" width="100%" />
            </p>
            <p className="caution">
              *Algunos condados pueden estar implementando <a href="https://www.cdc.gov/coronavirus/2019-ncov/more/scientific-brief-options-to-reduce-quarantine.html" rel="noreferrer" target="_blank">las nuevas pautas</a> de 
              la CDC para reducir la cuarentena. Sin embargo, debido a que esas pautas 
              varían de un condado a otro, Greenlight implementará la política de cuarentena 
              completa de 14 días para garantizar que nuestras comunidades permanezcan 
              lo más seguras posible. Si las directrices de su organización difieren de las 
              nuestras, siga las directrices de su organización.
            </p>
          </Es>
        </Tr>

      </Block>
    </Page>
  )
}
