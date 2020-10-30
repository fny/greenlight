import Honeybadger from 'honeybadger-js';

if (process.env.REACT_APP_HONEYBADGER_KEY) {
  Honeybadger.configure({
    apiKey: process.env.REACT_APP_HONEYBADGER_KEY,
  });
}

export default Honeybadger;
