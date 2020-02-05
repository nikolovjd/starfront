import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';
import { gameConfigGeneral } from '../config/gameConfig';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BaseService } from '../base/base.service';
import { BuildingService } from '../base/building.service';
import { ResearchService } from '../base/research.service';

@Injectable()
export class IncomeService {
  private tickCron: CronJob;

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly baseService: BaseService,
    private readonly buildingService: BuildingService,
    private readonly researchService: ResearchService,
  ) {
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

    const basesPendingConstruction = await this.baseService.getBasesWithPendingConstruction();

    const constructionPromises = [];
    for (const base of basesPendingConstruction) {
      constructionPromises.push(
        this.buildingService.tryBuildQueuedBuilding(base.id),
      );
    }

    await Promise.all(constructionPromises);

    const researchPromises = [];
    for (const base of basesPendingConstruction) {
      researchPromises.push(
        this.researchService.tryReseatchingQueuedResearch(base.id),
      );
    }

    await Promise.all(researchPromises);
  }
}
