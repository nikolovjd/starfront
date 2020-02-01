import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DequeueResearchRequestDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  index: number;
}
