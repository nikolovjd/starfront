import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { Empire } from './models/empire.entity';
import { Base } from '../base/models/base.entity';
import { EmpireAlreadyExistsError } from './exceptions';

@Injectable()
export class EmpireService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectRepository(Empire)
    private readonly empireRepository: Repository<Empire>,
  ) {}

  async create(userId: number) {
    return this.connection.transaction(async t => {
      const empire = t.getRepository(Empire).create({ user: { id: userId } });
      try {
        await t.save(empire);
      } catch (err) {
        if (err.message.includes('violates unique constraint')) {
          throw new EmpireAlreadyExistsError();
        }
      }
      const base = t.getRepository(Base).create({ empire });
      await t.save(base);
      return empire;
    });
  }
}
