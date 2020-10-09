import React, { createProvider, useGlobal } from 'reactn'

import './App.css'

import { App, View } from 'framework7-react'

import routes from './routes'
import { Framework7Params } from 'framework7/components/app/app-class'

import { I18nProvider } from '@lingui/react'
import { i18n } from './i18n'
import { Provider } from './providers'
import { ErrorBoundary } from './ErrorBoundary'

export default function () {
  const [ global, ] =  useGlobal()

  // Framework7 parameters here
  const f7params: Framework7Params = {
    id: 'com.greenlightready.mobile', // App bundle ID
    name: 'Greenlight', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes,
    view: {
      pushState: true
    },
  }


  return (
    <ErrorBoundary>
      <Provider>
        <I18nProvider language={global.locale} i18n={i18n}>
          <App params={f7params} className="App">
            <View id="main-view" url="/" main className="safe-areas" />
          </App>
        </I18nProvider>
      </Provider>
    </ErrorBoundary>
  )
}
