import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SchedulerModule } from './scheduler/scheduler.module';
import { EmpireModule } from './empire/empire.module';
import { TaskModule } from './task/task.module';
import { IncomeModule } from './income/income.module';
import { BaseController } from './empire/base.controller';
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
  controllers: [AppController, BaseController],
  providers: [AppService],
})
export class AppModule {}
