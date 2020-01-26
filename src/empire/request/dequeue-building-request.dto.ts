import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DequeueBuildingRequestDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  index: number;
}
