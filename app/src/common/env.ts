// See https://create-react-app.dev/docs/adding-custom-environment-variables/
// for details.

function required(key: string, backup?: string): string {
  const value = process.env[key] || backup || null
  if (value === null) {
    throw new Error("Missing required environment variable")
  }

  return value
}

const env = {
  isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production'
  },
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  },
  API_URL: required('REACT_APP_API_URL')
}

export default env
