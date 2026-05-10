import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: REDIS_CLIENT,
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('redis.url');
        if (url) {
          // REDIS_URL (e.g. rediss://default:password@host:port for Redis Cloud)
          return new Redis(url, { maxRetriesPerRequest: null });
        }
        const host = config.get<string>('redis.host');
        const port = config.get<number>('redis.port');
        if (!host || port == null) {
          throw new Error('Redis config: set REDIS_URL or both REDIS_HOST and REDIS_PORT in .env');
        }
        const username = config.get<string>('redis.username');
        const password = config.get<string>('redis.password');
        const useTls = config.get<boolean>('redis.tls');
        return new Redis({
          host,
          port,
          username,
          password,
          ...(useTls && { tls: {} }),
          maxRetriesPerRequest: null,
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
