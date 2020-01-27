/* tslint:disable:line:max-classes-per-file */

import { ConflictException } from '@nestjs/common';

export class UsernameAlreadyExistsError extends ConflictException {
  constructor() {
    super('Username already exists');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
