import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  EntityManager,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';
import { SchedulerService } from '../scheduler/scheduler.service';
import { Base } from './models/base.entity';
import { Empire } from './models/empire.entity';
import { Task } from '../task/models/task.entity';
import { Buildings, TaskStatus, Technologies } from '../types';
import {
  gameConfigGeneral,
  gameConfigTechnologies,
} from '../config/gameConfig';
import {
  BuildingAlreadyInProgressError,
  ResearchQueueFullError,
  NotEnoughCreditsError,
  RequirementsNotMetError,
  TechnologyAlreadyInResearchError,
  NoBuildingInConstructionError,
  NoTechnologyInResearchError,
} from './exceptions';

@Injectable()
export class ResearchService implements OnModuleInit {
  private stats;
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly scheduler: SchedulerService,
    @InjectRepository(Base)
    private readonly baseRepository: Repository<Base>,
    @InjectRepository(Empire)
    private readonly empireRepository: Repository<Empire>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {
    this.finishResearch = this.finishResearch.bind(this);
    this.stats = gameConfigTechnologies;
    this.scheduler.addTaskResolver(this.finishResearch, 'research');
  }

  public async researchTechnology(baseId, technology: Technologies) {
    await this.connection.transaction('REPEATABLE READ', async t => {
      await this.researchTechnologyTransaction(
        baseId,
        technology,
        t,
        new Date(),
      );
    });
  }

  public async cancelResearch(baseId) {
    await this.connection.transaction('REPEATABLE READ', async t => {
      const base = await this.baseRepository.findOne(baseId);
      const task = base.buildingTask;
      const empire = base.empire;
      if (task) {
        task.status = TaskStatus.CANCELLED;
        base.buildingTask = null;
        const refund = this.calculateCost(
          task.data.technology,
          empire[task.data.technology] + 1,
        );
        empire.credits += refund;
        await Promise.all([t.save(base), t.save(task), t.save(empire)]);
      } else {
        throw new NoTechnologyInResearchError();
      }
    });
  }

  public async queueResearch(baseId: number, technology: Technologies) {
    try {
      await this.connection.transaction(
        'REPEATABLE READ',
        async transaction => {
          const base = await transaction.getRepository(Base).findOne(baseId);
          const queue = base.researchQueue;
          queue.push(technology);
          await transaction.save(base);
        },
      );
    } catch (err) {
      if (err.message.includes('violates check constraint')) {
        throw new ResearchQueueFullError();
      }

      throw err;
    }
  }

  public async unqueueResearch(baseId: number, i: number) {
    await this.baseRepository
      .createQueryBuilder()
      .update()
      .set({
        // @ts-ignore
        researchQueue: () =>
          // Postgres arrays are 1 indexed
          `"researchQueue"[:${i}] || "researchQueue"[${i + 2}:]`,
      })
      .where({ id: baseId })
      .execute();
  }

  private async finishResearch(finishTask: Task, catchup = false) {
    await this.finishTask(finishTask);

    return this.connection.transaction('REPEATABLE READ', async transaction => {
      const base = await transaction
        .getRepository(Base)
        .findOne(finishTask.data.baseId);

      if (base.researchQueue.length) {
        const technology = base.researchQueue.shift();
        await transaction.save(base);
        return this.researchTechnologyTransaction(
          finishTask.data.baseId,
          technology,
          transaction,
          finishTask.end,
          catchup,
        );
      }
    });
  }

  private async researchTechnologyTransaction(
    baseId: number,
    technology: Technologies,
    transaction: EntityManager,
    start: Date,
    catchup = false,
  ) {
    start.setMilliseconds(0);

    const base = await transaction.getRepository(Base).findOne(baseId);
    const empire = base.empire;

    if (base.researchTask) {
      throw new BuildingAlreadyInProgressError();
    }

    const tasks = await transaction
      .getRepository(Task)
      .createQueryBuilder()
      .select()
      .where({ status: TaskStatus.IN_PROGRESS, type: 'research' })
      .andWhere(
        `"data" @> '{"technology": "${technology}"}' AND "data" @> '{"empireId": ${empire.id}}'`,
      )
      .getMany();

    if (tasks.length) {
      throw new TechnologyAlreadyInResearchError();
    }

    const level = empire[technology] + 1;
    const cost = this.calculateCost(technology, level);

    const labRequirement =
      gameConfigTechnologies[technology].requirements.researchLabs;

    if (base[Buildings.RESEARCH_LABS] < labRequirement) {
      throw new RequirementsNotMetError();
    }

    for (const requirement of gameConfigTechnologies[technology].requirements
      .technologies) {
      if (empire[requirement.technology] < requirement.level) {
        throw new RequirementsNotMetError();
      }
    }

    try {
      await transaction.decrement(Empire, { id: empire.id }, 'credits', cost);
    } catch (err) {
      if (err.message.includes('violates check constraint')) {
        throw new NotEnoughCreditsError();
      }

      throw err;
    }

    const task = transaction.getRepository(Task).create({
      type: 'research',
      start,
      end: this.getEndTime(base, start, cost),
      status: TaskStatus.IN_PROGRESS,
    });

    task.data = {
      technology,
      cost,
      baseId: base.id,
      empireId: empire.id,
    };

    await transaction.save(task);
    base.researchTask = task;
    await transaction.save(base);

    if (!catchup) {
      this.scheduler.addTask(task);
    }

    return task;
  }

  private async finishTask(finishTask: Task) {
    return this.connection.transaction(async transaction => {
      const task = await transaction.getRepository(Task).findOne(finishTask.id);

      if (task.status !== TaskStatus.IN_PROGRESS) {
        throw new Error('Not in progress');
      }

      const updateBase = transaction.update(Base, task.data.baseId, {
        researchTask: null,
      });

      const updateEmpire = transaction.update(Empire, task.data.empireId, {
        [task.data.technology]: () => `"${task.data.technology}" + 1`,
      });

      const finish = transaction.update(Task, task.id, {
        status: TaskStatus.FINISHED,
      });

      await Promise.all([updateBase, updateEmpire, finish]);
    });
  }

  private calculateCost(technology: Technologies, level: number) {
    const baseCost = gameConfigTechnologies[technology].baseCost;
    if (level === 1) {
      return baseCost;
    }
    return Math.ceil(baseCost * Math.pow(1.5, level - 1));
  }

  private getEndTime(base: Base, start: Date, cost: number) {
    return new Date(start.getTime() + (cost / base.research) * 60 * 60 * 1000);
  }

  async onModuleInit() {
    const date = new Date();
    const finishedTasks = await this.taskRepository
      .createQueryBuilder()
      .select()
      .where({
        type: 'research',
        status: TaskStatus.IN_PROGRESS,
        end: LessThanOrEqual(date),
      })
      .orderBy('"end"', 'ASC')
      .getMany();

    for (const task of finishedTasks) {
      try {
        let newTask = await this.finishResearch(task, true);
        while (newTask) {
          if (newTask.end <= date) {
            newTask = await this.finishResearch(newTask, true);
          } else {
            this.scheduler.addTask(newTask);
            break;
          }
        }
      } catch (err) {
        if (err instanceof NotEnoughCreditsError) {
          // Nothing
        } else {
          throw err;
        }
      }
    }

    const pendingTasks = await this.taskRepository
      .createQueryBuilder()
      .select()
      .where({
        type: 'research',
        status: TaskStatus.IN_PROGRESS,
        end: MoreThan(date),
      })
      .orderBy('"end"', 'ASC')
      .getMany();

    for (const task of pendingTasks) {
      this.scheduler.addTask(task);
    }
  }
}
