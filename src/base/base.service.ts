import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Base } from './models/base.entity';
import { Empire } from '../empire/models/empire.entity';
import { gameConfigGeneral } from '../config/gameConfig';

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

  public async createBase(empireId: number) {
    return this.connection.transaction(async t => {
      const empire = await t.getRepository(Empire).findOne(empireId);
      const bases = await t.getRepository(Base).find({ where: { empire } });
      const nextBaseCost = Math.round(
        gameConfigGeneral.base.cost *
          Math.pow(gameConfigGeneral.base.multiplier, bases.length - 1),
      );
      empire.credits -= nextBaseCost;
      await t.save(empire);
      const newBase = this.baseRepository.create({ empire });
      await t.save(newBase);
      return newBase;
    });
  }

  public async isOwner(baseId: number, empireId: number) {
    const base = await this.baseRepository.findOne(baseId);
    if (!base) {
      return false;
    }
    return base.empire.id === empireId;
  }

  public async getBasesWithPendingConstruction() {
    return this.baseRepository
      .createQueryBuilder()
      .where({ buildingTask: null })
      .andWhere(`array_length("buildingQueue", 1) > 0`)
      .getMany();
  }

  public async getBasesWithPendingResearch() {
    return this.baseRepository
      .createQueryBuilder('base')
      .leftJoinAndSelect('base.empire', 'empire')
      .where({ researchTask: null })
      .andWhere(`array_length("researchQueue", 1) > 0`)
      .getMany();
  }
}
