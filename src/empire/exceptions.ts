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

export class EmpireAlreadyExistsError extends ConflictException {
  constructor() {
    super('Empire already exists');
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

export class BuildingQueueFullError extends ConflictException {
  constructor() {
    super('Building queue full');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ResearchQueueFullError extends ConflictException {
  constructor() {
    super('Research queue full');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoBuildingInConstructionError extends ConflictException {
  constructor() {
    super('No building in construction');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NoTechnologyInResearchError extends ConflictException {
  constructor() {
    super('No technology in research');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
