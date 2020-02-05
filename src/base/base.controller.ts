import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Base } from './models/base.entity';
import { BaseService } from './base.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Base')
@Controller('base')
@UseGuards(AuthGuard())
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class BaseController {
  constructor(private readonly baseService: BaseService) {}
  @Post()
  async createBase(@Request() req) {
    return this.baseService.createBase(req.user.id);
  }

  @Get()
  @ApiOkResponse({ type: Base, isArray: true })
  @ApiConflictResponse()
  async getBases(@Request() req) {
    return this.baseService.getBasesForEmpireId(req.user.empireId);
  }

  @Get(':id')
  @ApiOkResponse({ type: Base })
  @ApiConflictResponse()
  async getBaseById(@Param('id', ParseIntPipe) id: number) {
    const base = await this.baseService.getBase(id);
    if (!base) {
      throw new NotFoundException();
    }
    return base;
  }
}
