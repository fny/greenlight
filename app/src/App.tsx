import React, { Fragment, getGlobal, useEffect, useGlobal } from 'reactn'

import './App.css'

import { App, View } from 'framework7-react'

import routes from './routes'
import { Framework7Params } from 'framework7/components/app/app-class'

import { I18nProvider, useLingui } from '@lingui/react'
import { i18n } from './i18n'
import { ErrorBoundary } from './ErrorBoundary'

import { ping } from './common/util'
const ONLINE_TEST_URL = 'http://neverssl.com/'
const PING_APP_URL = `${process.env.API_URL}/v1/ping`
/** How long to wait for a response in milisecconds */
const TIMEOUT = 5000

/** How long to wait in between checks with exponential backoff applied */
const CHECK_AFTER_MS = 1000
const HAS_ONLINE_SUPPORT = 'onLine' in navigator


function I18nWatchLocale({ children }: { children: React.ReactNode }) {
  const { i18n } = useLingui()

  // Skip render when locale isn't loaded
  if (!i18n.locale) return null

  // Force re-render by using active locale as an element key.
  return <Fragment key={i18n.locale}>{children}</Fragment>
}

export default function () {
  // Framework7 parameters here
  const f7params: Framework7Params = {
    id: 'com.greenlightready.mobile', // App bundle ID
    name: 'Greenlight', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes,
    view: {
      pushState: true,
      pushStateSeparator: "#"
    },
  }
  const [locale, ] = useGlobal('locale')
  const [, setAPIState] = useGlobal('apiState')
  const [, setInternetState] = useGlobal('internetState')

  useEffect(() => {
    const timerId = window.setInterval(() => {
      // Check if app is online
      ping(PING_APP_URL, TIMEOUT).then((isAPIOnline) => {
        setAPIState(isAPIOnline)
        if (!isAPIOnline) {
          if (HAS_ONLINE_SUPPORT) {
            setInternetState(navigator.onLine)
          } else {
            ping(ONLINE_TEST_URL, TIMEOUT).then((isInternetConnected) => {
              setInternetState(isInternetConnected)
            })
          }
        }
      })
    }, CHECK_AFTER_MS)

    return () => window.clearInterval(timerId)
  }, [])

  return (
    <ErrorBoundary>
      <I18nProvider i18n={i18n}>
        <I18nWatchLocale>
          <App key={locale} params={f7params} className="App">
            <View id="main-view" url="/" main className="safe-areas" />
          </App>
        </I18nWatchLocale>
      </I18nProvider>
    </ErrorBoundary>
  )
}
