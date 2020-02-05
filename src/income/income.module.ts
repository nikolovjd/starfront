import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { BaseModule } from '../base/base.module';

@Module({
  providers: [IncomeService],
  imports: [BaseModule],
})
export class IncomeModule {}
