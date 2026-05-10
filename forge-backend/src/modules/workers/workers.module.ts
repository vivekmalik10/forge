import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WorkersService } from './workers.service';

/**
 * Workers module - uses Bull queues backed by Redis.
 * Add processors and jobs here as needed (e.g. email, notifications, background tasks).
 */
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('redis.url');
        const redis = url
          ? url
          : (() => {
              const host = config.get<string>('redis.host');
              const port = config.get<number>('redis.port');
              if (!host || port == null) {
                throw new Error('Redis config: set REDIS_URL or both REDIS_HOST and REDIS_PORT in .env');
              }
              return {
                host,
                port,
                username: config.get<string>('redis.username'),
                password: config.get<string>('redis.password'),
                ...(config.get<boolean>('redis.tls') && { tls: {} }),
              };
            })();
        return {
          redis,
          defaultJobOptions: {
            removeOnComplete: 100,
            attempts: 3,
            backoff: { type: 'exponential', delay: 1000 },
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue(
      { name: 'default' },
      // Add more queues as needed, e.g. { name: 'email' }, { name: 'notifications' }
    ),
  ],
  providers: [WorkersService],
  exports: [BullModule, WorkersService],
})
export class WorkersModule {}
