/**
 * Raised when the current user is missing.
 */
export class NoCurrentUserError extends Error {
  constructor(message?: string) {
    message = message || 'Current user not found.';
    super(message);
    this.name = 'NoCurrentUserError';
  }
}
