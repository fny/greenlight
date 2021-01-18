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
    return (window as any).device.platform === 'iOS'
      ? process.env.REACT_APP_CODEPUSH_IOS || ''
      : (window as any).device.platform === 'Android'
      ? process.env.REACT_APP_CODEPUSH_ANDROID || ''
      : ''
  },
}

;(window as any).env = env

export default env
