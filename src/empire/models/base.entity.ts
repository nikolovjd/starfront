import {
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
import { Buildings } from '../../types';
import { Task } from '../../task/models/task.entity';
import { gameConfigGeneral } from '../../config/gameConfig';

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
  )
  empire: Empire;

  // -- TASKS ---

  @Column({ type: 'enum', enum: Buildings, array: true, default: [] })
  public buildingQueue: Buildings[];

  @OneToOne(type => Task)
  @JoinColumn()
  public buildingTask: Task;

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
}
