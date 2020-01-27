import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Base } from './base.entity';
import { User } from '../../user/models/user.entity';

@Entity()
@Check('"credits" >= 0')
@Check('"baseDiscount" >= 0')
export class Empire extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => User, { nullable: false })
  @JoinColumn()
  user: User;

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

  @Column({ default: 0 })
  baseDiscount: number;

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
