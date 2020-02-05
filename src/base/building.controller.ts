import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BuildingService } from './building.service';
import { BuildBuildingRequestDto } from '../empire/request/build-building-request.dto';
import { QueueBuildingRequestDto } from '../empire/request/queue-building-request.dto';
import {
  ApiOkResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { DequeueBuildingRequestDto } from '../empire/request/dequeue-building-request.dto';
import { DowngradeBuildingRequestDto } from '../empire/request/downgrade-building-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { BaseService } from './base.service';

@ApiTags('Building')
@Controller('base')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class BuildingController {
  constructor(
    private readonly buildingService: BuildingService,
    private readonly baseService: BaseService,
  ) {}
  @Post(':id/building/build')
  @ApiOkResponse()
  @ApiConflictResponse()
  async buildBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: BuildBuildingRequestDto,
    @Req() req: any,
  ) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.buildingService.buildBuilding(id, data.building);
  }

  @Post(':id/building/queue')
  @ApiOkResponse()
  @ApiConflictResponse()
  async queueBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: QueueBuildingRequestDto,
    @Req() req: any,
  ) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.buildingService.queueBuilding(id, data.building);
  }

  @Post(':id/building/dequeue')
  @ApiOkResponse()
  @ApiConflictResponse()
  async dequeueBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DequeueBuildingRequestDto,
    @Req() req: any,
  ) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.buildingService.unqueueBuilding(id, data.index);
  }

  @Post(':id/building/cancel')
  @ApiOkResponse()
  @ApiConflictResponse()
  async cancelBuilding(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.buildingService.cancelBuilding(id);
  }

  @Post(':id/building/downgrade')
  @ApiOkResponse()
  @ApiConflictResponse()
  async downgradeBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DowngradeBuildingRequestDto,
    @Req() req: any,
  ) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.buildingService.deleteBuilding(id, data.building);
  }
}
