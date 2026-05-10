import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

/**
 * Workers service - enqueue and process background jobs.
 * Add job producers and consumers (processors) as needed.
 */
@Injectable()
export class WorkersService {
  constructor(
    @InjectQueue('default')
    private readonly defaultQueue: Queue,
  ) {}

  /**
   * Example: add a job to the default queue.
   * Use this pattern for email, notifications, etc.
   */
  async addJob<T = object>(name: string, data: T, options?: { delay?: number; priority?: number }) {
    return this.defaultQueue.add(name, data, {
      delay: options?.delay,
      priority: options?.priority,
    });
  }

  getDefaultQueue(): Queue {
    return this.defaultQueue;
  }
}
