import React, { useEffect, useGlobal } from 'reactn'
import { v1 } from 'src/api'
import { ping, setIntervalSafely } from 'src/helpers/util'
import './OnlineStatus.css'
import Tr from './Tr'

const ONLINE_TEST_URL = 'http://neverssl.com/'
/** How long to wait for a response in milisecconds */
const TIMEOUT = 5000

/** How long to wait in between checks */
const CHECK_AFTER_SECS = 60
const HAS_ONLINE_SUPPORT = 'onLine' in navigator

function testInternet(): Promise<boolean> {
  if (HAS_ONLINE_SUPPORT) {
    return Promise.resolve(navigator.onLine)
  }
  return ping(ONLINE_TEST_URL, TIMEOUT)
}

export default function OnlineStatus(): JSX.Element {
  const [isAPIOnline, setIsAPIOnline] = useGlobal('isAPIOnline')
  const [isInternetOnline, setIsInternetOnline] = useGlobal('isInternetOnline')

  function checkConnection(checkApi: boolean = false) {
    testInternet().then((internetStatus) => {
      setIsInternetOnline(internetStatus)

      if (internetStatus && checkApi) {
        v1.get('ping')
          .then(() => setIsAPIOnline(true))
          .catch(() => setIsAPIOnline(false))
      }
    })
  }

  useEffect(() => {
    const timerId = setIntervalSafely(() => {
      checkConnection()
    }, CHECK_AFTER_SECS * 1000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [])

  // We need explicit false checks because it is undefined by default
  if (isInternetOnline === false) {
    return (
      <div className="OnlineStatus">
        <Tr en="Your internet is disconnected." es="Tu internet está desconectado." />
        <button type="button" className="retry" onClick={() => checkConnection(true)}>
          <Tr en="Retry" es="Vuelve a intentarlo" />
        </button>
      </div>
    )
  }

  // We need explicit false checks because it is undefined by default
  if (isAPIOnline === false) {
    return (
      <div className="OnlineStatus">
        <Tr en="Can't connect to Greenlight." es="No se puede conectar a Greenlight." />
        <button type="button" className="retry" onClick={() => checkConnection(true)}>
          <Tr en="Retry" es="Vuelve a intentarlo" />
        </button>
      </div>
    )
  }

  return <></>
}
