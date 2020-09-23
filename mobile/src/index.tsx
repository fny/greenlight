import './common/models'

import React, { setGlobal } from 'reactn'

import ReactDOM from 'react-dom'

import App from './App'
import * as serviceWorker from './serviceWorker'

import './common/GL'

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle'

// Import Framework7-React plugin
import Framework7React from 'framework7-react'

// Framework7 styles
import 'framework7/css/framework7.bundle.css'
import 'framework7-icons'

import './index.css'

import addReactNDevTools from 'reactn-devtools';
import { getCurrentUser, session, destroySession } from './common/api'
addReactNDevTools();

setGlobal({
  language: 'en'
})


// Init Framework7-React plugin
Framework7.use(Framework7React)

function render() {
  ReactDOM.render(<App />,document.getElementById('root'))
}

if (session.isValid()) {
  console.debug('Valid session.')
  getCurrentUser().then(user => {
    setGlobal({ currentUser: user })
    render()
  }).catch(err => {
    destroySession()
  })
} else {
  render()
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
