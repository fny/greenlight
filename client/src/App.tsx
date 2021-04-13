import React, { useGlobal } from 'reactn'

import './App.css'

import {
  App, Progressbar, View,
} from 'framework7-react'

import { Framework7Params } from 'framework7/components/app/app-class'

import routes from 'src/config/routes'
import { MyI18n } from 'src/i18n'
import { ErrorBoundary } from 'src/ErrorBoundary'
import OnlineStatus from 'src/components/OnlineStatus'
import env from './config/env'
import StillRegisteringMessage from './components/FlashMessage'

// Framework7 parameters here
const f7params: Framework7Params = {
  id: 'com.greenlightready.mobile', // App bundle ID
  name: 'Greenlight', // App name
  theme: 'auto', // Automatic theme detection
  routes,
}

if (!env.isCordova()) {
  f7params.view = {
    pushState: true,
    pushStateSeparator: '',
  }
}

export default function Main(): JSX.Element {
  const [global] = useGlobal()

  return (
    <MyI18n.Provider value={global.locale}>
      <App key={global.locale} params={f7params} className="App">
        <OnlineStatus />
        <StillRegisteringMessage />
        <ErrorBoundary>
          { global.progress && <Progressbar color="green" progress={global.progress} /> }

          <View id="main-view" url="/" main className="safe-areas" />
        </ErrorBoundary>
      </App>
    </MyI18n.Provider>
  )
}
