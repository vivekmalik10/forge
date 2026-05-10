import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
  type HealthIndicatorResult,
} from '@nestjs/terminus';
import { Public } from '../auth/decorators/public.decorator';
import { RedisService } from '../redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    private readonly redisService: RedisService,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 2000 }),
      () => this.redisPing(),
    ]);
  }

  @Public()
  @Get('live')
  live(): { status: string } {
    return { status: 'ok' };
  }

  private async redisPing(): Promise<HealthIndicatorResult> {
    try {
      const client = this.redisService.getClient();
      await client.ping();
      return { redis: { status: 'up' as const } };
    } catch {
      return { redis: { status: 'down' as const } };
    }
  }
}
