import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../../types';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status: string;

  @Column()
  start: Date;

  @Column()
  end: Date;

  @Column({ type: 'jsonb' })
  data: any;

  @UpdateDateColumn()
  updatedAt: Date;
}
