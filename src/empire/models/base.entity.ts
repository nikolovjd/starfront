import {
  AfterLoad,
  BaseEntity,
  Check,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Empire } from './empire.entity';
import { Buildings } from '../../types';
import { Task } from '../../task/models/task.entity';
import {
  gameConfigGeneral,
  gameConfigStructures,
} from '../../config/gameConfig';

@Entity()
@Check(
  `array_length("buildingQueue", 1) <= ${gameConfigGeneral.base.maxQueueLength}`,
)
@Check('"urbanStructures" >= 1')
export class Base extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Empire,
    empire => empire.bases,
    { eager: true },
  )
  empire: Empire;

  // -- TASKS ---

  @Column({ type: 'enum', enum: Buildings, array: true, default: [] })
  public buildingQueue: Buildings[];

  @OneToOne(type => Task)
  @JoinColumn()
  public buildingTask: Task;

  // -- STATS --
  @Column({ default: 75 })
  public baseArea: number;

  @Column({ default: 6 })
  public baseFertility: number;

  @Column({ default: 3 })
  public solar: number;

  @Column({ default: 1 })
  public gas: number;

  @Column({ default: 3 })
  public metal: number;

  @Column({ default: 3 })
  public crystal: number;

  @Column({ default: 0 })
  public economy: number;

  @Column({ default: 0 })
  public income: number;

  // -- COMPUTED STATS --
  public area: number;
  public usedArea: number;
  public population: number;
  public usedPopulation: number;
  public energy: number;
  public usedEnergy: number;
  public fertility: number;
  public construction: number;
  public production: number;

  @AfterLoad()
  getComputedStats() {
    // NOTE: fertility NEEDS to be first since its used for calculating population
    this.fertility = this.calculateTotalStat('fertility');
    this.area = this.calculateTotalStat('area');
    this.usedArea = this.calculateUsedStat('area');
    this.population = this.calculateTotalStat('population');
    this.usedPopulation = this.calculateUsedStat('population');
    this.energy = this.calculateTotalStat('energy');
    this.usedEnergy = this.calculateUsedStat('energy');
    this.construction = this.calculateTotalStat('construction');
    this.production = this.calculateTotalStat('production');
  }

  // -- BUILDINGS ---
  @Column({ default: 1 })
  public [Buildings.URBAN_STRUCTURES]: number;

  @Column({ default: 0 })
  public [Buildings.SOLAR_PLANTS]: number;

  @Column({ default: 0 })
  public [Buildings.GAS_PLANTS]: number;

  @Column({ default: 0 })
  public [Buildings.FUSTION_PLANTS]: number;

  @Column({ default: 0 })
  public [Buildings.ANTIMATTER_PLANTS]: number;

  @Column({ default: 0 })
  public [Buildings.ORBITAL_PLANTS]: number;

  @Column({ default: 0 })
  public [Buildings.RESEARCH_LABS]: number;

  @Column({ default: 0 })
  public [Buildings.METAL_REFINERIES]: number;

  @Column({ default: 0 })
  public [Buildings.CRYSTAL_MINES]: number;

  @Column({ default: 0 })
  public [Buildings.ROBOTIC_FACTORIES]: number;

  @Column({ default: 0 })
  public [Buildings.SHIPYARDS]: number;

  @Column({ default: 0 })
  public [Buildings.ORBITAL_SHIPYARDS]: number;

  @Column({ default: 0 })
  public [Buildings.SPACEPORTS]: number;

  @Column({ default: 0 })
  public [Buildings.COMMAND_CENTERS]: number;

  @Column({ default: 0 })
  public [Buildings.NANITE_FACTORIES]: number;

  @Column({ default: 0 })
  public [Buildings.ANDROID_FACTORIES]: number;

  @Column({ default: 0 })
  public [Buildings.ECONOMIC_CENTERS]: number;

  @Column({ default: 0 })
  public [Buildings.TERRAFORM]: number;

  @Column({ default: 0 })
  public [Buildings.MULTI_LEVEL_PLATFORMS]: number;

  @Column({ default: 0 })
  public [Buildings.ORBITAL_BASE]: number;

  @Column({ default: 0 })
  public [Buildings.JUMP_GATE]: number;

  @Column({ default: 0 })
  public [Buildings.BIOSPHERE_MODIFICATION]: number;

  @Column({ default: 0 })
  public [Buildings.CAPITAL]: number;

  private calculateTotalStat(
    s:
      | 'area'
      | 'population'
      | 'energy'
      | 'fertility'
      | 'construction'
      | 'production',
  ) {
    let total = 0;

    for (const building of Object.values(Buildings)) {
      for (const stat of gameConfigStructures[building].stats) {
        if (stat.stat === s) {
          if (stat.type === 'value') {
            total += stat.value * this[building];
          } else {
            total += this[stat.fromBase] * this[building];
          }
        }
      }
    }

    switch (s) {
      case 'area':
        total += this.baseArea;
        break;
      case 'energy':
        total += 2; // TODO: config
        total *= Math.round(1 + 0.05 * this.empire.energy);
        break;
      case 'population':
        break;
      case 'fertility':
        total += this.baseFertility;
        break;
      case 'construction':
        total += gameConfigGeneral.base.startingConstruction;
    }

    return total;
  }

  private calculateUsedStat(s: 'energy' | 'population' | 'area') {
    let used = 0;
    for (const building of Object.values(Buildings)) {
      used +=
        this[building] * gameConfigStructures[building].requirements.stats[s];
    }

    return used;
  }

  // -- DEFENSES ---
  // TODO:
}
