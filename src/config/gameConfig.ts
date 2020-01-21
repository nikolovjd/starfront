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
}

interface GameConfigGeneral {
  base: GameConfigBase;
}

type GameConfigStructures = {
  [key in Buildings]?: StructureStats;
};

export const gameConfigStructures = structures as GameConfigStructures;
export const gameConfigGeneral = general as GameConfigGeneral;
