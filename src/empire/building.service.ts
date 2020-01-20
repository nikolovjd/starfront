import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection, InjectRepository } from '@nestjs/typeorm';
import { Base } from './models/base.entity';
import {
  Connection,
  EntityManager,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';
import { Buildings, TaskStatus } from '../types';
import { Empire } from './models/empire.entity';
import { Task } from '../task/models/task.entity';
import { SchedulerService } from '../scheduler/scheduler.service';
import {
  BuildingAlreadyInProgressError,
  BuildingQueueFullError,
  NotEnoughCreditsError,
} from './exceptions';
import { gameConfigGeneral, gameConfigStructures } from '../config/gameConfig';

@Injectable()
export class BuildingService implements OnModuleInit {
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
    this.finishBuilding = this.finishBuilding.bind(this);
    this.stats = gameConfigStructures;
    this.scheduler.addTaskResolver(this.finishBuilding, 'building');
  }

  public async buildBuilding(
    baseId,
    building: Buildings,
    transaction?: EntityManager,
  ) {
    if (transaction) {
      await this.buildBuildingTransaction(
        baseId,
        building,
        transaction,
        new Date(),
      );
    } else {
      await this.connection.transaction(async t => {
        await this.buildBuildingTransaction(baseId, building, t, new Date());
      });
    }
  }

  public async queueBuilding(baseId, building: Buildings) {
    await this.connection.transaction(async transaction => {
      const base = await transaction
        .getRepository(Base)
        .findOne(baseId, { relations: ['empire', 'buildingTask'] });

      if (base.buildingQueue.length >= gameConfigGeneral.base.maxQueueLength) {
        throw new BuildingQueueFullError();
      }

      try {
        await transaction.update(Base, base.id, {
          // @ts-ignore
          buildingQueue: () => `array_append("buildingQueue", '${building}')`,
        });
      } catch (err) {
        if (err.message.includes('violates check constraint')) {
          throw new BuildingQueueFullError();
        }

        throw err;
      }
    });
  }

  private async buildBuildingTransaction(
    baseId,
    building: Buildings,
    transaction: EntityManager,
    start: Date,
    catchup = false,
  ) {
    start.setMilliseconds(0);

    const base = await transaction
      .getRepository(Base)
      .findOne(baseId, { relations: ['empire', 'buildingTask'] });
    const empire = base.empire;

    if (base.buildingTask) {
      throw new BuildingAlreadyInProgressError();
    }

    const level = base[building] + 1;
    const cost = this.calculateCost(building, level);

    try {
      await transaction.decrement(Empire, { id: empire.id }, 'credits', cost);
    } catch (err) {
      if (err.message.includes('violates check constraint')) {
        throw new NotEnoughCreditsError();
      }

      throw err;
    }

    const task = transaction.getRepository(Task).create({
      type: 'building',
      start,
      end: this.getEndTime(base, start, cost),
      status: TaskStatus.IN_PROGRESS,
    });

    task.data = {
      building,
      cost,
      baseId: base.id,
    };

    await transaction.save(task);
    base.buildingTask = task;
    await transaction.save(base);

    if (!catchup) {
      this.scheduler.addTask(task);
    }

    return task;
  }

  private async finishBuilding(finishTask: Task, catchup = false) {
    await this.finishTask(finishTask);

    return this.connection.transaction(async transaction => {
      const base = await transaction
        .getRepository(Base)
        .findOne(finishTask.data.baseId, {
          relations: ['empire', 'buildingTask'],
        });

      if (base.buildingQueue.length) {
        const building = base.buildingQueue.shift();
        await transaction.save(base);
        return this.buildBuildingTransaction(
          finishTask.data.baseId,
          building,
          transaction,
          finishTask.end,
          catchup,
        );
      }
    });
  }

  private async finishTask(finishTask: Task) {
    return this.connection.transaction(async transaction => {
      const task = await transaction.getRepository(Task).findOne(finishTask.id);

      if (task.status !== TaskStatus.IN_PROGRESS) {
        throw new Error('Not in progress');
      }

      const updateBase = transaction.update(Base, task.data.baseId, {
        buildingTask: null,
        [task.data.building]: () => `"${task.data.building}" + 1`,
      });

      const finish = transaction.update(Task, task.id, {
        status: TaskStatus.FINISHED,
      });

      await Promise.all([updateBase, finish]);
    });
  }

  private calculateCost(building: Buildings, level: number) {
    const baseCost = gameConfigStructures[building].baseCost;
    if (level === 1) {
      return baseCost;
    }
    return Math.ceil(baseCost * Math.pow(1.5, level - 1));
  }

  private getEndTime(base: Base, start: Date, cost: number) {
    return new Date(start.getTime() + 1 * 1000);
  }

  async onModuleInit() {
    const date = new Date();
    const finishedTasks = await this.taskRepository
      .createQueryBuilder()
      .select()
      .where({
        type: 'building',
        status: TaskStatus.IN_PROGRESS,
        end: LessThanOrEqual(date),
      })
      .orderBy('"end"', 'ASC')
      .getMany();

    for (const task of finishedTasks) {
      try {
        let newTask = await this.finishBuilding(task, true);
        while (newTask) {
          if (newTask.end <= date) {
            newTask = await this.finishBuilding(newTask, true);
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
        type: 'building',
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
