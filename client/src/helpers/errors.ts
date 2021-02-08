export class NoCurrentUserError extends Error {
  isNoCurrentUserError = true

  constructor() {
    super('Current user is required, but none was found.')
  }
}
