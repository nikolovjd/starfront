export interface ITask {
  id: number;
  type: string;
  data: any;
  start: Date;
  end: Date;
}

export enum TaskStatus {
  IN_PROGRESS = 'in-progress',
  CANCELLED = 'cancelled',
  FINISHED = 'finished',
}

export enum Buildings {
  URBAN_STRUCTURES = 'urbanStructures',
  SOLAR_PLANTS = 'solarPlants',
  GAS_PLANTS = 'gasPlants',
  FUSTION_PLANTS = 'fusionPlants',
  ANTIMATTER_PLANTS = 'antimatterPlants',
  ORBITAL_PLANTS = 'orbitalPlants',
  RESEARCH_LABS = 'researchLabs',
  METAL_REFINERIES = 'metalRefineries',
  CRYSTAL_MINES = 'crystalMines',
  ROBOTIC_FACTORIES = 'roboticFactories',
  SHIPYARDS = 'shipyards',
  ORBITAL_SHIPYARDS = 'orbitalShipyards',
  SPACEPORTS = 'spaceports',
  COMMAND_CENTERS = 'commandCenters',
  NANITE_FACTORIES = 'naniteFactories',
  ANDROID_FACTORIES = 'androidFactories',
  ECONOMIC_CENTERS = 'economicCenters',
  TERRAFORM = 'terraform',
  MULTI_LEVEL_PLATFORMS = 'multiLevelPlatforms',
  ORBITAL_BASE = 'orbitalBase',
  JUMP_GATE = 'jumpGate',
  BIOSPHERE_MODIFICATION = 'biosphereModification',
  CAPITAL = 'capital',
}

export enum Technologies {
  ENERGY = 'energy',
  COMPUTER = 'computer',
  ARMOUR = 'armour',
  LASER = 'laser',
  MISSILES = 'missiles',
  STELLAR_DRIVE = 'stellarDrive',
  PLASMA = 'plasma',
  WARP_DRIVE = 'warpDrive',
  SHIELDING = 'shielding',
  ION = 'ion',
  PHOTON = 'photon',
  ARTIFICIAL_INTELLIGENCE = 'artificialIntelligence',
  DISRUPTOR = 'disruptor',
  CYBERNETICS = 'cybernetics',
  TACHYON_COMMUNICATIONS = 'tachyonCommunications',
  ANTI_GRAVITY = 'antiGravity',
}

export enum BaseStats {
  FERTILITY = 'fertility',
  AREA = 'area',
  GAS = 'gas',
  SOLAR = 'solar',
  METAL = 'metal',
  CRYSTAL = 'crystal',
  CONSTRUCTION = 'construction',
  PRODUCTION = 'production',
  ECONOMY = 'economy',
}
