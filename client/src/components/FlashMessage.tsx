import { Link } from 'framework7-react'
import React from 'react'
import { useGlobal } from 'reactn'
import { paths } from 'src/config/routes'
import { isRegisteringLocation, resetRegistration } from 'src/helpers/global'
import { lcTrans } from 'src/models/Location'

import './StillRegisteringMessage.css'
import Tr from './Tr'

export default function StillRegisteringMessage(): JSX.Element {
  const [registeringLocation] = useGlobal('registeringLocation')
  const [currentRoute] = useGlobal('currentRoute')
  const isOnRegistrationPage = currentRoute?.url.includes('register/location')

  if (isOnRegistrationPage || !isRegisteringLocation()) return <></>

  return (
    <div className="StillRegisteringMessage">
      <Tr en="You're not done registering your" es="No ha completado el registro de su" /> {lcTrans(registeringLocation.category)}!
      <Link className="continue" href={paths.registerLocationWelcomePath}><Tr en="Go" es="Sigue" /></Link>
      <button type="button" className="continue" onClick={() => resetRegistration()}>
        &nbsp;&times;&nbsp;
      </button>
    </div>
  )
}
