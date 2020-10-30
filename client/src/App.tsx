import React, { Fragment, useGlobal } from 'reactn';

import './App.css';

import { App, View } from 'framework7-react';

import { Framework7Params } from 'framework7/components/app/app-class';

import { I18nProvider, useLingui } from '@lingui/react';
import routes from './routes';
import { i18n as myI18n } from './i18n';
import { ErrorBoundary } from './ErrorBoundary';

function I18nWatchLocale({ children }: { children: React.ReactNode }) {
  const { i18n } = useLingui();

  // Skip render when locale isn't loaded
  if (!i18n.locale) return null;

  // Force re-render by using active locale as an element key.
  return <Fragment key={i18n.locale}>{children}</Fragment>;
}

export default function Main() {
  // Framework7 parameters here
  const f7params: Framework7Params = {
    id: 'com.greenlightready.mobile', // App bundle ID
    name: 'Greenlight', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes,
    view: {
      pushState: true,
      pushStateSeparator: '#',
    },
  };
  const [locale] = useGlobal('locale');

  return (
    <ErrorBoundary>
      <I18nProvider i18n={myI18n}>
        <I18nWatchLocale>
          <App key={locale} params={f7params} className="App">
            <View id="main-view" url="/" main className="safe-areas" />
          </App>
        </I18nWatchLocale>
      </I18nProvider>
    </ErrorBoundary>
  );
}
