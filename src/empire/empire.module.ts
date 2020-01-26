import { Module } from '@nestjs/common';
import { EmpireService } from './empire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from './models/base.entity';
import { Empire } from './models/empire.entity';
import { BuildingService } from './building.service';
import { Task } from '../task/models/task.entity';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { BaseController } from './base.controller';

@Module({
  providers: [EmpireService, BuildingService],
  controllers: [BaseController],
  exports: [BuildingService],
  imports: [TypeOrmModule.forFeature([Empire, Base, Task]), SchedulerModule],
})
export class EmpireModule {}
