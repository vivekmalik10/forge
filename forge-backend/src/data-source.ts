/**
 * TypeORM DataSource for CLI only (migration:generate, migration:run).
 * The Nest app uses TypeOrmModule in app.module.ts; this file is not used at runtime.
 * Requires DATABASE_URL in .env (no default).
 */
import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error('Missing required env: DATABASE_URL. Set it in .env for migrations (see .env.example).');
}

export default new DataSource({
  type: 'postgres',
  url,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
