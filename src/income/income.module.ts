import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';

@Module({
  providers: [IncomeService],
})
export class IncomeModule {}
