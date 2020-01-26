/* tslint:disable:line:max-classes-per-file */

import { ConflictException } from '@nestjs/common';

export class BuildingAlreadyInProgressError extends ConflictException {
  constructor() {
    super('Building already in progress');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

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

export class BuildingQueueFullError extends ConflictException {
  constructor() {
    super('Building queue full');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoBuildingInConstructionError extends ConflictException {
  constructor() {
    super('No building in construction');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
