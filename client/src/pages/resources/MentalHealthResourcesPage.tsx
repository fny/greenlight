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

export default function MentalHealthResourcesPage(): JSX.Element {
  const [currentUser] = useGlobal('currentUser')
  assertNotNull(currentUser)

  return (
    <Page className="PositiveResourcesPage">
      <Navbar title={
        tr({
          en: 'Mental Health Resources: HOPE4NC',
          es: 'Caso sintomático o positivo',
        })
      }
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block>
        <Tr>
          <En>
            <p>Find hope. Find help. 💚</p>
            <p>Crisis counseling, 24 hours a day 7 days a week during COVID-19</p>
            <p>Free and confidential.</p>
          </En>
          <Es>
            <p>Encuentre esperanza. Encuentre ayuda. 💚</p>
            <p>Asesoriamiento en caso de crisis, las 24 hoursa del día, los 7 días de la semana durante la COVID-19.</p>
            <p>Gratis y confidencial.</p>
          </Es>
        </Tr>
        <p style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          <Tr>
            <En>Call <a href="tel:1-855-587-3463" target="_blank">1-855-587-3463</a></En>
            <Es>Llama <a href="tel:1-855-587-3463" target="_blank">1-855-587-3463</a></Es>
          </Tr>
        </p>
        <Tr>
          <En>
            <p>
              Fear and anxiety about COVID-19 can be overwhelming for adults, youth and children.
              Everyone has different stress responses that may include:
            </p>
            <ul>
              <li>Feeling alone</li>
              <li>Irritable or feeling out of sorts</li>
              <li>Head, stomach or body aches</li>
              <li>Changes in sleep or eating patterns</li>
              <li>Difficulty concentrating, forgetful</li>
              <li>Fear for your own health</li>
              <li>Worried about the health of your family or friends</li>
              <li>Increased use of alcohol, tobacco or other drugs</li>
              <li>Feeling stuck, no time for self-care</li>
              <li>Looking for ideas to stay calm and healthy</li>
            </ul>
            <p>We are here to help.</p>
          </En>
          <Es>
            <p>
              El miedo y la ansiedad por el COVID-19 pueden ser abrumadores para adultos, jóvenes y niños.
              Todos tenemos diferentes respuestas al estrés que pueden incluir:
             </p>
             <ul>
               <li> Sentirse solo </li>
               <li> Irritable o sentirse de mal humor </li>
               <li> Dolores de cabeza, estómago o cuerpo </li>
               <li> Cambios en los patrones de sueño o alimentación </li>
               <li> Dificultad para concentrarse, olvidadizo </li>
               <li> Temor por tu propia salud </li>
               <li> Preocupado por la salud de su familia o amigos </li>
               <li> Mayor uso de alcohol, tabaco u otras drogas </li>
               <li> Sentirse atascado, sin tiempo para cuidarse a sí mismo </li>
               <li> Buscando ideas para mantener la calma y la salud </li>
             </ul>
             <p> Estamos aquí para ayudar. </p>
          </Es>
        </Tr>
      </Block>
    </Page>
  )
}
