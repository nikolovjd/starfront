import { Module } from '@nestjs/common';
import { BaseController } from './base.controller';
import { BaseService } from './base.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Base } from './models/base.entity';

@Module({
  controllers: [BaseController],
  providers: [BaseService],
  imports: [TypeOrmModule.forFeature([Base])],
})
export class BaseModule {}
