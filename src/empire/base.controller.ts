import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildBuildingRequestDto } from './request/build-building-request.dto';
import { QueueBuildingRequestDto } from './request/queue-building-request.dto';
import { ApiOkResponse, ApiConflictResponse } from '@nestjs/swagger';
import { Base } from './models/base.entity';
import { DequeueBuildingRequestDto } from './request/dequeue-building-request.dto';
import { DowngradeBuildingRequestDto } from './request/downgrade-building-request.dto';

@Controller('base')
@UseInterceptors(ClassSerializerInterceptor)
export class BaseController {
  constructor(private readonly buildingService: BuildingService) {}

  @Get()
  @ApiOkResponse({ type: Base, isArray: true })
  @ApiConflictResponse()
  async getBases() {
    return this.buildingService.getBasesForEmpireId(1);
  }

  @Get(':id')
  @ApiOkResponse({ type: Base })
  @ApiConflictResponse()
  async gerBaseById(@Param('id', ParseIntPipe) id: number) {
    const base = await this.buildingService.getBase(id);
    if (!base) {
      throw new NotFoundException();
    }
    return base;
  }

  // -- BUILDING --

  @Post(':id/building/build')
  @ApiOkResponse()
  @ApiConflictResponse()
  async buildBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: BuildBuildingRequestDto,
  ) {
    await this.buildingService.buildBuilding(id, data.building);
  }

  @Post(':id/building/queue')
  @ApiOkResponse()
  @ApiConflictResponse()
  async queueBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: QueueBuildingRequestDto,
  ) {
    await this.buildingService.queueBuilding(id, data.building);
  }

  @Post(':id/building/dequeue')
  @ApiOkResponse()
  @ApiConflictResponse()
  async dequeueBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DequeueBuildingRequestDto,
  ) {
    await this.buildingService.unqueueBuilding(id, data.index);
  }

  @Post(':id/building/cancel')
  @ApiOkResponse()
  @ApiConflictResponse()
  async cancelBuilding(@Param('id', ParseIntPipe) id: number) {
    await this.buildingService.cancelBuilding(id);
  }

  @Post(':id/building/downgrade')
  @ApiOkResponse()
  @ApiConflictResponse()
  async downgradeBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DowngradeBuildingRequestDto,
  ) {
    await this.buildingService.deleteBuilding(id, data.building);
  }
}
