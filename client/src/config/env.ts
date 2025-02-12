// See https://create-react-app.dev/docs/adding-custom-environment-variables/
// for details.

function required(key: string, backup?: string): string {
  const value = process.env[key] || backup || null
  if (value === null) {
    throw new Error('Missing required environment variable')
  }

  return value
}

const env = {
  isCordova(): boolean {
    return !!process.env.REACT_APP_CORDOVA
  },
  isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production'
  },
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  },
  API_URL: (() => {
    const herokuAppName = process.env.REACT_APP_HEROKU_APP_NAME
    if (herokuAppName) {
      return `https://${herokuAppName}.herokuapp.com/api`
    }
    return required('REACT_APP_API_URL')
  })(),
  codePushDeploymentKey(): string {
    const platform = (window as any).device?.platform
    switch (platform) {
      case 'iOS':
        return required('REACT_APP_CODEPUSH_IOS')
      case 'Android':
        return required('REACT_APP_CODEPUSH_ANDROID')
      case null:
      case undefined:
        throw new Error('No code push device platform detected')
      default:
        throw new Error(`Unsure where to find code push deployment key for given platform ${platform}`)
        break
    }
  },
};
(window as any).env = env

export default env
