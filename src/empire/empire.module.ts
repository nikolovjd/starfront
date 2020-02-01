import { Module } from '@nestjs/common';
import { EmpireService } from './empire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from '../base/models/base.entity';
import { Empire } from './models/empire.entity';
import { BuildingService } from './building.service';
import { Task } from '../task/models/task.entity';
import { SchedulerModule } from '../scheduler/scheduler.module';
import { BuildingController } from './building.controller';
import { EmpireController } from './empire.controller';

@Module({
  providers: [EmpireService, BuildingService],
  controllers: [BuildingController, EmpireController],
  exports: [BuildingService],
  imports: [TypeOrmModule.forFeature([Empire, Base, Task]), SchedulerModule],
})
export class EmpireModule {}
