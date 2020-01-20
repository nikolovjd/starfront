import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';

@Entity()
@Check('"credits" >= 0')
export class Empire extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 100 })
  credits: number;

  @OneToMany(
    type => Base,
    base => base.empire,
  )
  bases: Base[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  income: number;

  // Technologies
  @Column({ default: 0 })
  energy: number;

  @Column({ default: 0 })
  computer: number;

  @Column({ default: 0 })
  laser: number;

  @Column({ default: 0 })
  missiles: number;

  @Column({ default: 0 })
  stellarDrive: number;

  @Column({ default: 0 })
  plasma: number;

  @Column({ default: 0 })
  warpDrive: number;

  @Column({ default: 0 })
  shielding: number;

  @Column({ default: 0 })
  ion: number;

  @Column({ default: 0 })
  photon: number;

  @Column({ default: 0 })
  artificialIntelligence: number;

  @Column({ default: 0 })
  disruptor: number;

  @Column({ default: 0 })
  cybernetics: number;

  @Column({ default: 0 })
  tachyonCommunications: number;

  @Column({ default: 0 })
  antiGravity: number;
}
