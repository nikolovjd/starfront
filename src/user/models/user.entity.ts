import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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

  @Column()
  password: string;
}
