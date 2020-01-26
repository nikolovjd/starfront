import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Technologies } from '../../types';

export class QueueResearchRequestDto {
  @ApiProperty({ enum: Technologies })
  @IsEnum(Technologies)
  technology: Technologies;
}
