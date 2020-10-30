/* eslint-disable no-console */

import Honeybadger from 'honeybadger-js';
import env from './env';

const logger = {
  log(...args: any[]) {
    console.log(...args);
  },
  error(...args: any[]) {
    console.error(...args);
    if (env.isProduction()) {
      Honeybadger.notify(...args);
    }
  },
  dev(...args: any[]) {
    if (env.isDevelopment()) {
      console.log(...args);
    }
  },
  devReturn(args: any) {
    if (env.isDevelopment()) {
      console.log(args);
    }
    return args;
  },
};

export default logger;
