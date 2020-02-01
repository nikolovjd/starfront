import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Base } from './models/base.entity';

@Injectable()
export class BaseService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Base)
    private readonly baseRepository: Repository<Base>,
  ) {}

  public async getBase(baseId: number) {
    return this.baseRepository.findOne(baseId);
  }

  public async getBasesForEmpireId(empireId: number) {
    return this.baseRepository.find({ where: { empire: { id: empireId } } });
  }
}
