import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulerModule } from './scheduler/scheduler.module';
import { EmpireModule } from './empire/empire.module';
import { TaskModule } from './task/task.module';
import { IncomeModule } from './income/income.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    SchedulerModule,
    EmpireModule,
    TaskModule,
    IncomeModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
