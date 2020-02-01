import { Module } from '@nestjs/common';
import { ResearchController } from './research.controller';
import { ResearchService } from './research.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empire } from '../empire/models/empire.entity';
import { Base } from '../base/models/base.entity';
import { Task } from '../task/models/task.entity';
import { SchedulerModule } from '../scheduler/scheduler.module';

@Module({
  controllers: [ResearchController],
  providers: [ResearchService],
  imports: [TypeOrmModule.forFeature([Empire, Base, Task]), SchedulerModule],
})
export class ResearchModule {}
