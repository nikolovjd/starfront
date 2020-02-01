/* tslint:disable:line:max-classes-per-file */

import { ConflictException } from '@nestjs/common';

export class NotEnoughCreditsError extends ConflictException {
  constructor() {
    super('Not enough credits');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RequirementsNotMetError extends ConflictException {
  constructor() {
    super('Requirements not met');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class TechnologyAlreadyInResearchError extends ConflictException {
  constructor() {
    super('Technology already in research');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResearchQueueFullError extends ConflictException {
  constructor() {
    super('Research queue full');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoTechnologyInResearchError extends ConflictException {
  constructor() {
    super('No technology in research');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
