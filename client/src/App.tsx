import React, { Fragment, useGlobal } from 'reactn'

import './App.css'

import { App, View } from 'framework7-react'

import { Framework7Params } from 'framework7/components/app/app-class'

import { I18nProvider, useLingui } from '@lingui/react'
import routes from './routes'
import { i18n as globalI18n } from './i18n'
import { ErrorBoundary } from './ErrorBoundary'
import OnlineStatus from './components/OnlineStatus'
import SupportedBrowserBar from './components/SupportedBrowserBar'

function I18nWatchLocale({ children }: { children: React.ReactNode }) {
  const { i18n } = useLingui()

  // Skip render when locale isn't loaded
  if (!i18n.locale) return null
  // Force re-render by using active locale as an element key.
  return <Fragment key={i18n.locale}>{children}</Fragment>
}

export default function Main() {
  // Framework7 parameters here
  const f7params: Framework7Params = (window as any).cordova
    ? {
        id: 'com.greenlightready.mobile', // App bundle ID
        name: 'Greenlight', // App name
        theme: 'auto', // Automatic theme detection
        // App routes
        routes,
      }
    : {
        id: 'com.greenlightready.mobile', // App bundle ID
        name: 'Greenlight', // App name
        theme: 'auto', // Automatic theme detection
        // App routes
        routes,
        view: {
          pushState: true,
          pushStateSeparator: '',
        },
      }

  console.log('f7params', f7params)

  const [locale] = useGlobal('locale')

  return (
    <ErrorBoundary>
      <I18nProvider i18n={globalI18n}>
        <I18nWatchLocale>
          <App key={locale} params={f7params} className="App">
            <SupportedBrowserBar />
            <OnlineStatus />
            <View id="main-view" url="/" main className="safe-areas" />
          </App>
        </I18nWatchLocale>
      </I18nProvider>
    </ErrorBoundary>
  )
}
