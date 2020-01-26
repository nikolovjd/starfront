import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../../types';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Exclude()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column({ type: 'enum', enum: TaskStatus })
  status: string;

  @Column()
  start: Date;

  @Expose()
  @ApiProperty()
  @Column()
  end: Date;

  @Expose()
  @ApiProperty()
  @Column({ type: 'jsonb' })
  data: any;

  @UpdateDateColumn()
  updatedAt: Date;
}
