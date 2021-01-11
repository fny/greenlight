import React, { Fragment, useGlobal } from 'reactn'

import './App.css'

import { App, Progressbar, View } from 'framework7-react'

import { Framework7Params } from 'framework7/components/app/app-class'

import { I18nProvider, useLingui } from '@lingui/react'
import routes from 'src/config/routes'
import { i18n as globalI18n } from 'src/i18n'
import { ErrorBoundary } from 'src/ErrorBoundary'
import OnlineStatus from 'src/components/OnlineStatus'
import env from './config/env'

function I18nWatchLocale({ children }: { children: React.ReactNode }) {
  const { i18n } = useLingui()

  // Skip render when locale isn't loaded
  if (!i18n.locale) return null
  // Force re-render by using active locale as an element key.
  return <Fragment key={i18n.locale}>{children}</Fragment>
}

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
    <I18nProvider i18n={globalI18n}>
      <I18nWatchLocale>
        <App key={global.locale} params={f7params} className="App">
          <OnlineStatus />
          <ErrorBoundary>
            { global.progress && <Progressbar color="green" progress={global.progress} /> }

            <View id="main-view" url="/" main className="safe-areas" />
          </ErrorBoundary>
        </App>
      </I18nWatchLocale>
    </I18nProvider>
  )
}
