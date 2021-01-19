import React, { setGlobal } from 'reactn'
import ReactDOM from 'react-dom'

// Initialize dependencies
import './initializers'
import * as serviceWorker from './initializers/serviceWorker'
import cordovaApp from './initializers/cordova'

// Assets
import 'framework7/css/framework7.bundle.css'
import 'framework7-icons'
import 'src/assets/fonts/Aeonik/index.css'
import 'src/assets/fonts/Rubik/index.css'
import 'src/assets/styles/index.css'

import App from './App'
import { getCurrentUser } from './api'
import env from './config/env'

function render() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

function startApp() {
  getCurrentUser()
    .then((user) => {
      setGlobal({ currentUser: user, locale: user.locale })
    })
    .catch((err) => {
      if (err.response && err.response.status === 401) {
        // Not signed in, so lets clear up anything thats hanging around
        localStorage.clear()
      } else {
        throw err
      }
    })
    .finally(() => {
      render()
    })
}

if (env.isCordova()) {
  cordovaApp.initialize({
    startApp,
  })
} else {
  startApp()
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
