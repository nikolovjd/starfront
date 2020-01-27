import {
  AfterLoad,
  BaseEntity,
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Empire } from './empire.entity';
import { Buildings, Technologies } from '../../types';
import { Task } from '../../task/models/task.entity';
import {
  gameConfigGeneral,
  gameConfigStructures,
} from '../../config/gameConfig';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

@Entity()
@Check(
  `array_length("buildingQueue", 1) <= ${gameConfigGeneral.base.maxQueueLength}`,
)
@Check('"urbanStructures" >= 1')
@Exclude()
export class Base extends BaseEntity {
  @Expose()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => Empire,
    empire => empire.bases,
    { eager: true, nullable: false },
  )
  empire: Empire;

  // -- TASKS ---

  @Expose()
  @ApiProperty()
  @Column({ type: 'enum', enum: Buildings, array: true, default: [] })
  public buildingQueue: Buildings[];

  @Expose()
  @ApiModelProperty()
  @Column({ type: 'enum', enum: Technologies, array: true, default: [] })
  public researchQueue: Technologies[];

  @Expose()
  @ApiProperty()
  @OneToOne(type => Task, { eager: true })
  @JoinColumn()
  public buildingTask: Task;

  @Expose()
  @ApiProperty()
  @OneToOne(type => Task, { eager: true })
  @JoinColumn()
  public researchTask: Task;

  // -- STATS --
  @Column({ default: 75 })
  public baseArea: number;

  @Column({ default: 6 })
  public baseFertility: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 3 })
  public solar: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 1 })
  public gas: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 3 })
  public metal: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 3 })
  public crystal: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public economy: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public income: number;

  // -- COMPUTED STATS --
  @Expose()
  @ApiProperty()
  public area: number;

  @Expose()
  @ApiProperty()
  public usedArea: number;

  @Expose()
  @ApiProperty()
  public population: number;

  @Expose()
  @ApiProperty()
  public usedPopulation: number;

  @Expose()
  @ApiProperty()
  public energy: number;

  @Expose()
  @ApiProperty()
  public usedEnergy: number;

  @Expose()
  @ApiProperty()
  public fertility: number;

  @Expose()
  @ApiProperty()
  public construction: number;

  @Expose()
  @ApiProperty()
  public production: number;

  @Expose()
  @ApiProperty()
  public research: number;

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
    this.research = this.calculateTotalStat('research');
  }

  // -- BUILDINGS ---
  @Expose()
  @ApiProperty()
  @Column({ default: 1 })
  public [Buildings.URBAN_STRUCTURES]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.SOLAR_PLANTS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.GAS_PLANTS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.FUSTION_PLANTS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.ANTIMATTER_PLANTS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.ORBITAL_PLANTS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.RESEARCH_LABS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.METAL_REFINERIES]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.CRYSTAL_MINES]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.ROBOTIC_FACTORIES]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.SHIPYARDS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.ORBITAL_SHIPYARDS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.SPACEPORTS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.COMMAND_CENTERS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.NANITE_FACTORIES]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.ANDROID_FACTORIES]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.ECONOMIC_CENTERS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.TERRAFORM]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.MULTI_LEVEL_PLATFORMS]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.ORBITAL_BASE]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.JUMP_GATE]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.BIOSPHERE_MODIFICATION]: number;

  @Expose()
  @ApiProperty()
  @Column({ default: 0 })
  public [Buildings.CAPITAL]: number;

  private calculateTotalStat(
    s:
      | 'area'
      | 'population'
      | 'energy'
      | 'fertility'
      | 'construction'
      | 'production'
      | 'research',
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
