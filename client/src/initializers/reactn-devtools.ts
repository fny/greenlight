import env from 'src/env';

if (env.isDevelopment()) {
  import('reactn-devtools').then((tools) => tools.default());
}
