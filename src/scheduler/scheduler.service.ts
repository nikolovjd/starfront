import { Injectable } from '@nestjs/common';
import { CronJob } from 'cron';

@Injectable()
export class SchedulerService {
  private taskQueue: Task[] = [];
  private taskManagers: Map<string, (task: Task) => void> = new Map();
  private tickCron: CronJob;

  constructor() {
    this.tickCron = new CronJob('* * * * * *', this.tick.bind(this));
    this.tickCron.start();
  }

  public addTask(task: Task) {
    this.insertTask(task);
  }

  public addTaskResolver(
    taskManager: (task: Task) => void,
    taskType: string,
  ): void {
    this.taskManagers.set(taskType, taskManager);
  }

  private insertTask(task: Task): void {
    const insertIndex = this.findInsertIndex(task);

    if (insertIndex >= this.taskQueue.length) {
      this.taskQueue.push(task);
    } else {
      this.taskQueue.splice(insertIndex + 1, 0, task);
    }
  }

  private removeTask(task: Task) {
    const deleteIndex = this.taskQueue.findIndex(t => t.id === task.id);
    this.taskQueue.splice(deleteIndex, 1);
  }

  private findInsertIndex(task: Task): number {
    let beginning = 0;
    let end = this.taskQueue.length;
    // tslint:disable-next-line:no-bitwise
    let pivot = ~~(this.taskQueue.length / 2);

    const time = task.end.getTime();

    while (beginning !== end) {
      if (time < this.taskQueue[pivot].end.getTime()) {
        if (pivot !== end) {
          end = pivot;
        } else {
          end = pivot - 1;
        }
        // tslint:disable-next-line:no-bitwise
        pivot = beginning + ~~((end - beginning) / 2);
      } else {
        if (pivot !== beginning) {
          beginning = pivot;
        } else {
          beginning = pivot + 1;
        }
        // tslint:disable-next-line:no-bitwise
        pivot = beginning + ~~((end - beginning) / 2);
      }
    }

    if (!this.taskQueue[pivot]) {
      return pivot;
    }

    if (this.taskQueue[pivot].end.getTime() === time) {
      return pivot + 1;
    }

    if (time < this.taskQueue[pivot].end.getTime()) {
      return pivot - 1;
    } else {
      return pivot + 1;
    }
  }

  private tick() {
    const tickTasks = this.getTasksForTick();

    if (!tickTasks.length) {
      return;
    }

    for (const task of tickTasks) {
      this.taskManagers.get(task.type)(task);
      this.removeTask(task);
    }
  }

  private getTasksForTick(): Task[] {
    const time = Date.now();

    const tasks: Task[] = [];

    for (const task of this.taskQueue) {
      if (task.end.getTime() <= time) {
        tasks.push(task);
      } else {
        break;
      }
    }

    return tasks;
  }
}
