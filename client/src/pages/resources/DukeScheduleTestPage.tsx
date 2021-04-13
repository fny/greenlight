import React from 'react'
import {
  Page, Navbar, Block,
} from 'framework7-react'
import NavbarHomeLink from 'src/components/NavbarHomeLink'
import Tr, { En, Es, tr } from 'src/components/Tr'

export default function DukeScheduleTestPage(): JSX.Element {
  return (
    <Page>
      <Navbar
        title={tr({ en: 'Schedule a Test', es: 'Programar una prueba' })}
      >
        <NavbarHomeLink slot="left" />
      </Navbar>
      <Block strong>
        <p>
          <Tr>
            <En>
              From 8:00am to 5pm, please call the number below to schedule a test.
              Dial 2 when you hear the automated voice to reach the patient line.
            </En>
            <Es>
              Desde las 8 de la mañana hasta las 5 de la tarde, llama al número
              que aparece a continuación para programar una prueba. Marque 2
              cuando escuche la voz automatizada para comunicarse con la línea del paciente.
            </Es>
          </Tr>
        </p>

        <p style={{ fontSize: '1.5rem', textAlign: 'center', fontWeight: 'bold' }}>
          <Tr>
            <En>Call <a href="tel:1-919-385-0429" target="_blank">919-385-0429</a>, then Dial 2</En>
            <Es>Llama a <a href="tel:1-919-385-0429" target="_blank">919-385-0429</a>, luego marque 2</Es>
          </Tr>

        </p>
        <p>
          <Tr>
            <Es>Dígale a quienquiera que hable que necesita programar una prueba y que usa la aplicación Greenlight.</Es>
            <En>Tell whomever you speak with that you need to schedule a test and you use the Greenlight app.</En>
          </Tr>
        </p>
        <p>
          <Tr>
            <En>You should be scheduled within 24 hours and receive a result the following day.
              If you <b>have symptoms</b>, you may need to schedule a <b>telemedicine appointment</b> prior to testing.
            </En>
            <Es>Debe programarlo dentro de las 24 horas y recibir un resultado al día siguiente. Si tiene síntomas, es posible que deba programar una cita de telemedicina antes de la prueba.</Es>
          </Tr>
        </p>
      </Block>
    </Page>
  )
}
