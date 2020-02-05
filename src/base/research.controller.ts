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
import {
  ApiOkResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger';
import { ResearchService } from './research.service';
import { ResearchTechnologyRequestDto } from './request/research-technology-request.dto';
import { QueueResearchRequestDto } from './request/queue-research-request.dto';
import { DequeueResearchRequestDto } from './request/dequeue-research-request.dto';
import { AuthGuard } from '@nestjs/passport';
import { BaseService } from './base.service';

@ApiTags('Research')
@Controller('base')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class ResearchController {
  constructor(
    private readonly researchService: ResearchService,
    private readonly baseService: BaseService,
  ) {}
  @Post(':id/research/research')
  @ApiOkResponse()
  @ApiConflictResponse()
  async researchTechnology(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: ResearchTechnologyRequestDto,
    @Req() req: any,
  ) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.researchService.researchTechnology(id, data.technology);
  }

  @Post(':id/research/queue')
  @ApiOkResponse()
  @ApiConflictResponse()
  async queueResearch(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: QueueResearchRequestDto,
    @Req() req: any,
  ) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.researchService.queueResearch(id, data.technology);
  }

  @Post(':id/research/dequeue')
  @ApiOkResponse()
  @ApiConflictResponse()
  async dequeueResearch(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: DequeueResearchRequestDto,
    @Req() req: any,
  ) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.researchService.unqueueResearch(id, data.index);
  }

  @Post(':id/research/cancel')
  @ApiOkResponse()
  @ApiConflictResponse()
  async cancelResearch(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    if (!(await this.baseService.isOwner(id, req.user.empireId))) {
      throw new ForbiddenException();
    }
    await this.researchService.cancelResearch(id);
  }
}
