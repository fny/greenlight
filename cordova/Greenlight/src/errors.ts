class ApplicationError extends Error {}
/**
 * Raised when the current user is missing.
 */
export class NoCurrentUserError extends ApplicationError {
  constructor(message?: string) {
    message = message || 'Current user not found.'
    super(message)
  }
}
