/**
 * Entry application component used to compose providers and render Routes.
 * */

import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Routes } from "../app/Routes";
import { I18nProvider as MetronicI18nProvider } from "../_metronic/i18n";
import { I18nProvider } from '@lingui/react'
import { LayoutSplashScreen, MaterialThemeProvider } from "../_metronic/layout";

import '../common/stores/sources'

import i18n from '../i18n'
import history from '../history'


export default function App({ store, persistor, basename }) {
  return (
    /* Provide Redux store */
    <Provider store={store}>
      {/* Asynchronously persist redux stores and show `SplashScreen` while it's loading. */}
      <PersistGate persistor={persistor} loading={<LayoutSplashScreen />}>
        {/* Add high level `Suspense` in case if was not handled inside the React tree. */}
        <React.Suspense fallback={<LayoutSplashScreen />}>
          {/* Override `basename` (e.g: `homepage` in `package.json`) */}
          <MetronicI18nProvider>
          <Router basename={basename} history={history}>
            {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
            <MaterialThemeProvider>
              {/* Provide `react-intl` context synchronized with Redux state.  */}
              <I18nProvider language="en" i18n={i18n}>
                {/* Render routes with provided `Layout`. */}
                <Routes />
              </I18nProvider>
            </MaterialThemeProvider>
          </Router>
          </MetronicI18nProvider>
        </React.Suspense>
      </PersistGate>
    </Provider>
  );
}
