import { validateEnv, requireEnv } from './env';

export default () => {
  validateEnv();

  const redisUrl = process.env.REDIS_URL;
  const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : undefined;

  return {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    env: process.env.NODE_ENV ?? 'development',
    database: {
      url: requireEnv('DATABASE_URL'),
    },
    redis: {
      url: redisUrl,
      host: process.env.REDIS_HOST,
      port: redisPort,
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      tls: process.env.REDIS_TLS === 'true' || process.env.REDIS_TLS === '1',
    },
    jwt: {
      secret: requireEnv('JWT_SECRET'),
      expiresIn: requireEnv('JWT_EXPIRES_IN'),
      refreshExpiresIn: requireEnv('JWT_REFRESH_EXPIRES_IN'),
    },
    cors: {
      origin: process.env.CORS_ORIGIN === '' ? undefined : process.env.CORS_ORIGIN,
    },
  };
};
