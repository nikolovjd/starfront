import { Module } from '@nestjs/common';
import { BaseController } from './base.controller';
import { BaseService } from './base.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from './models/base.entity';
import { BuildingService } from './building.service';
import { BuildingController } from './building.controller';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { Task } from '../task/models/task.entity';
import { ResearchService } from './research.service';
import { ResearchController } from './research.controller';

@Module({
  controllers: [BaseController, BuildingController, ResearchController],
  providers: [BaseService, BuildingService, ResearchService],
  imports: [TypeOrmModule.forFeature([Base, Task]), SchedulerModule],
  exports: [BaseService, BuildingService, ResearchService],
})
export class BaseModule {}
