/* tslint:disable:line:max-classes-per-file */

export class BuildingAlreadyInProgressError extends Error {
  constructor() {
    super('Building already in progress');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotEnoughCreditsError extends Error {
  constructor() {
    super('Not enough credits');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RequirementsNotMetError extends Error {
  constructor() {
    super('Requirements not met');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BuildingQueueFullError extends Error {
  constructor() {
    super('Building queue full');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
