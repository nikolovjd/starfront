import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { gameConfigGeneral } from '../config/gameConfig';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class IncomeService {
  private tickCron: CronJob;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.tickCron = new CronJob(
      gameConfigGeneral.incomeCron,
      this.tick.bind(this),
    );
    this.tickCron.start();
  }

  private async tick() {
    await this.connection.query(
      // language = SQL
      'UPDATE empire\n' +
        'SET credits = credits + sub.total_income\n' +
        'FROM (\n' +
        '    SELECT  SUM(income) AS total_income, b."empireId"\n' +
        '    FROM base AS b\n' +
        '    GROUP BY b."empireId"\n' +
        '     ) AS sub\n' +
        'WHERE sub."empireId" = id',
    );
  }
}
