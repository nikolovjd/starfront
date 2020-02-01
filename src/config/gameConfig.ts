/* tslint:disable:line:no-var-requires */
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

export const gameConfigStructures = JSON.parse(
  process.env.structuresConfig,
) as GameConfigStructures;
export const gameConfigGeneral = JSON.parse(
  process.env.generalConfig,
) as GameConfigGeneral;
export const gameConfigTechnologies = JSON.parse(
  process.env.technologiesConfig,
) as GameConfigTechnologies;
export const ormConfig = JSON.parse(process.env.ormConfig);
