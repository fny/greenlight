/* eslint-disable no-console */

import Honeybadger, { HoneyBadgerNotifyOptions } from 'src/initializers/honeybadger'
import env from '../config/env'

const logger = {
  notify(error: any | HoneyBadgerNotifyOptions, options?: HoneyBadgerNotifyOptions): void {
    if (options) {
      Honeybadger.notify(error, options)
    } else {
      Honeybadger.notify(error)
    }
  },
  log(...args: any[]): void {
    console.log(...args)
  },
  warn(...args: any[]): void {
    console.warn(...args)
  },
  error(...args: any[]): void {
    console.error(...args)
  },
  dev(...args: any[]): void {
    if (env.isDevelopment()) {
      console.log(...args)
    }
  },
  devReturn(args: any): void {
    if (env.isDevelopment()) {
      console.log(args)
    }
    return args
  },
}

export default logger
