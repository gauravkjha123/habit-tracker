import { HttpError } from 'routing-controllers';

export class UserNotFound extends HttpError {
  constructor() {
    super(404, `user not found.`);
  }
}
export class UserAlreadyExist extends HttpError {
  constructor(email) {
    super(404, `user with email '${email}' already exist.`);
  }
}

export class invalidCredentials extends HttpError {
  constructor() {
    super(404, `Invalid credentails.`);
  }
}

export class PasswordNotMatch extends HttpError {
  constructor() {
    super(404, `Password not match.`);
  }
}