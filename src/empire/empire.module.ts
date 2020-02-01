import { Module } from '@nestjs/common';
import { EmpireService } from './empire.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empire } from './models/empire.entity';
import { EmpireController } from './empire.controller';

@Module({
  providers: [EmpireService],
  controllers: [EmpireController],
  exports: [],
  imports: [TypeOrmModule.forFeature([Empire])],
})
export class EmpireModule {}
