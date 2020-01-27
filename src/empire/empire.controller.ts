import { Controller } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Empire } from './models/empire.entity';

@Controller('empire')
export class EmpireController {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Empire)
    private readonly empireRepository: Repository<Empire>,
  ) {}

  // TODO: base location, etc
  async startEmpire(userId: number) {
    // TODO
  }
}
