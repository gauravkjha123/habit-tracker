import { HttpError } from 'routing-controllers';

export class HabitNotFoundError extends HttpError {
  constructor() {
    super(404, `habit not found.`);
  }
}

export class HabitAlreadyExistError extends HttpError {
  constructor(name) {
    super(404, `habit wuth name ${name} already exist.`);
  }
}
