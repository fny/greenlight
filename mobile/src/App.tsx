import React from 'react';
import 'typeface-poppins'
import 'typeface-open-sans'

import './App.css';

import {
  App,
  Panel,
  View,
  Popup,
  Page,
  Navbar,
  NavRight,
  Link,
  Block,
  LoginScreen,
  LoginScreenTitle,
  List,
  ListInput,
  ListButton,
  BlockFooter,
  Toolbar
} from 'framework7-react';

import routes from './routes';
import { Framework7Params } from 'framework7/components/app/app-class';

export default function () {

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
    <App params={f7params} className="App">
      {/* Statusbar */}
      {/* <Statusbar /> */}


      {/* Main View */}
      <View id="main-view" url="/" main className="safe-areas" />
    </App>
  );
};
