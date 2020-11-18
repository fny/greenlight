export class ApplicationError extends Error {
  // __proto__: Error;
  // constructor(message?: string) {
  //   const trueProto = new.target.prototype;
  //   super(message);
  //   this.__proto__ = trueProto;
  // }
}

export class NoCurrentUserError extends ApplicationError {
  constructor() {
    super("Current user is required, but none was found.")
  }
}
