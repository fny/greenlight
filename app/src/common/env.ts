const env = {
  isDevelopment(): boolean {
    return process.env.NODE_ENV !== 'production'
  },
  isProduction(): boolean {
    return process.env.NODE_ENV === 'production'
  }
}


export default env
