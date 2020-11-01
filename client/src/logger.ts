/* eslint-disable no-console */

import Honeybadger from 'honeybadger-js'
import env from './env'

const logger = {
  notify(...args: any[]) {
    Honeybadger.notify(...args)
  },
  log(...args: any[]) {
    console.log(...args)
  },
  warn(...args: any[]) {
    console.warn(...args)
  },
  error(...args: any[]) {
    console.error(...args)
  },
  dev(...args: any[]) {
    if (env.isDevelopment()) {
      console.log(...args)
    }
  },
  devReturn(args: any) {
    if (env.isDevelopment()) {
      console.log(args)
    }
    return args
  },
}

export default logger
