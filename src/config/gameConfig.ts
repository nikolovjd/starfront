/* tslint:disable:line:no-var-requires */
const general = require('../../config/game/general.json');
const structures = require('../../config/game/structures.json');
const technologies = require('../../config/game/technologies.json');
import { BaseStats, Buildings, Technologies } from '../types';

interface TechnologyRequirement {
  technology: Technologies;
  level: number;
}

interface StructureRequirementStats {
  energy: number;
  population: number;
  area: number;
}

interface StructureRequirements {
  stats: StructureRequirementStats;
  technologies: TechnologyRequirement[];
}

interface StructureProvidedStats {
  stat: string;
  type: 'base' | 'value';
  value?: number;
  fromBase?: BaseStats;
}

interface StructureStats {
  baseCost: number;
  requirements: StructureRequirements;
  stats: StructureProvidedStats[];
}

interface GameConfigBase {
  cost: number;
  multiplier: number;
  maxQueueLength: number;
  startingConstruction: number;
  buildingDowngradeRefund: number;
  buildingCancelRefund: number;
}

interface GameConfigGeneral {
  base: GameConfigBase;
  incomeCron: string;
}

type GameConfigStructures = {
  [key in Buildings]?: StructureStats;
};

interface TechnologyRequirements {
  researchLabs: number;
  technologies: TechnologyRequirement[];
}

interface TechnologyStats {
  baseCost: number;
  requirements: TechnologyRequirements;
}

type GameConfigTechnologies = {
  [key in Technologies]?: TechnologyStats;
};

export const gameConfigStructures = structures as GameConfigStructures;
export const gameConfigGeneral = general as GameConfigGeneral;
export const gameConfigTechnologies = technologies as GameConfigTechnologies;
