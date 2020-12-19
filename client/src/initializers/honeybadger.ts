import Honeybadger from 'honeybadger-js'
import { Dict } from 'src/types'

if (process.env.REACT_APP_HONEYBADGER_KEY) {
  Honeybadger.configure({
    apiKey: process.env.REACT_APP_HONEYBADGER_KEY,
  })
}

export interface HoneyBadgerNotifyOptions {
  messsage?: string
  name?: string
  action?: string
  context?: Dict<any>
  fingerprint?: string
  environment?: string
  projectRoot?: string
  params?: Dict<string>
  // May also be sent as a string in the document.cookie "foo=bar;bar=baz" format.
  cookies?: Dict<string> | string
}

export default Honeybadger
