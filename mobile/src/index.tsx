import React, { setGlobal, addCallback } from 'reactn'

import ReactDOM from 'react-dom'

import App from './App'
import * as serviceWorker from './serviceWorker'

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle'

// Import Framework7-React plugin
import Framework7React from 'framework7-react'

// Framework7 styles
import 'framework7/css/framework7.bundle.css'
import './index.css'
import fixtures from './fixtures'

// Init Framework7-React plugin
Framework7.use(Framework7React)

// addCallback((global) => {
//   window.localStorage.setItem('globalState', JSON.stringify(global));
// })

setGlobal({
  currentUser: fixtures.users.mother
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
