import './initializers'

import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'

import Framework7 from 'framework7/framework7.esm.bundle'
import Framework7React from 'framework7-react'
import App from './App'
import * as serviceWorker from './initializers/serviceWorker'

import 'framework7/css/framework7.bundle.css'
import 'framework7-icons'

import 'src/assets/fonts/Poppins/index.css'
import 'src/assets/styles/index.css'

import { getCurrentUser } from './api'
import logger from './helpers/logger'
import { isCordova } from './helpers/util'

// Init Framework7-React plugin
Framework7.use(Framework7React)

function render() {
  // window.onload = () => {
  ReactDOM.render(<App />, document.getElementById('root'))
  // }
}

function startApp() {
  getCurrentUser()
    .then((user) => {
      setGlobal({ currentUser: user, locale: user.locale })
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        logger.error(err)
      } else {
        throw err
      }
    })
    .finally(() => {
      render()
    })
}

if (isCordova()) {
  document.addEventListener('deviceready', startApp, false)
  document.addEventListener('resume', () => {
    logger.log('resume')
    ;(window as any).codePush.checkForUpdate(function (update: boolean) {
      if (!update) {
        logger.log('The app is up to date.')
      } else {
        logger.log('An update is available! Should we download it?')
        ;(window as any).codePush.sync(null, { updateDialog: true, installMode: (window as any).InstallMode.IMMEDIATE })
      }
    })
  })
} else {
  startApp()
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
