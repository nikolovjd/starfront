import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Empire } from '../../empire/models/empire.entity';

@Entity()
@Exclude()
export class User {
  @Expose()
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @ApiProperty()
  @Column({ unique: true })
  username: string;

  @OneToOne(
    type => Empire,
    empire => empire.user,
  )
  empire: Empire;

  @Column()
  password: string;
}
