import env from 'src/config/env'

if (env.isDevelopment()) {
  import('reactn-devtools').then((tools) => tools.default())
}
