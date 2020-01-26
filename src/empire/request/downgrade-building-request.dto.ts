import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Buildings } from '../../types';

export class DowngradeBuildingRequestDto {
  @ApiProperty({ enum: Buildings })
  @IsEnum(Buildings)
  building: Buildings;
}
