import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Buildings } from '../../types';

export class QueueBuildingRequestDto {
  @ApiProperty({ enum: Buildings })
  @IsEnum(Buildings)
  building: Buildings;
}
