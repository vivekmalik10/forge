# Forge Backend

NestJS API with PostgreSQL, Redis, JWT authentication, and Bull workers.

## Stack

- **NestJS** – API framework
- **PostgreSQL** – Database (TypeORM)
- **Redis** – Cache + job queue (Bull)
- **JWT** – Authentication (Passport)
- **Bull** – Background workers (ready for jobs)

## Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Redis 6+

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set **all** required values. The app does **not** use code defaults for secrets, URLs, or expiry – it will throw at startup if any required env var is missing.

   ```bash
   cp .env.example .env
   ```

   Required: `PORT`, `DATABASE_URL`, `REDIS_URL` (or `REDIS_HOST` + `REDIS_PORT`), `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`. Optional: `CORS_ORIGIN` (omit or set to `true` to allow all origins).

3. **Database**

   Create a PostgreSQL database named `forge` (or use the URL in `.env`).
   In development, TypeORM will sync schema automatically (see [Database & migrations](#database--migrations)).

4. **Run**

   ```bash
   # Development
   npm run start:dev

   # Production build
   npm run build
   npm run start:prod
   ```

API runs at `http://localhost:3000` (or `PORT` from `.env`).

## Database & migrations

### Where are the tables?

Tables are defined by **TypeORM entities**, not by raw SQL. Each entity file maps to one table.

- **Current table:** `users` → defined in `src/users/entities/user.entity.ts`
- **Adding a new table:** Create a new entity (e.g. `src/posts/entities/post.entity.ts`) and register it in a module with `TypeOrmModule.forFeature([Post])`. With `synchronize: true` (dev), the table is created on next run.

### Adding a new table or column

**Development (synchronize enabled):**

1. Add or edit an entity under `src/**/entities/*.entity.ts` (e.g. add a column to `User` or create `Post`).
2. Restart the app; TypeORM will create/update tables automatically.

**Production (use migrations):**

1. Add or edit the entity as above.
2. Generate a migration from the diff between entities and the current DB:
   ```bash
   npm run migration:generate -- src/migrations/AddYourChangeName
   ```
   (e.g. `AddPostsTable`, `AddPhoneToUsers`). This creates a new file in `src/migrations/`.
3. Review the generated `up()` and `down()` in that file, then run:
   ```bash
   npm run migration:run
   ```
   Migrations use `DATABASE_URL` from `.env` and the DataSource in `src/data-source.ts`.

### Migration scripts

- `npm run migration:generate -- src/migrations/MigrationName` – Generate a migration from entity changes
- `npm run migration:run` – Run all pending migrations
- `npm run migration:revert` – Revert the last migration

`src/data-source.ts` is used only by the TypeORM CLI for migrations; the Nest app uses `TypeOrmModule` in `app.module.ts`.

## Auth API

- **POST /auth/register** – Register (body: `email`, `password`, optional `name`) → returns `accessToken`, `refreshToken`, `user`
- **POST /auth/login** – Login (body: `email`, `password`) → returns `accessToken`, `refreshToken`, `user`
- **POST /auth/refresh** – Issue new tokens (body: `refreshToken`) → returns new `accessToken`, `refreshToken`, `user`. Uses Redis to validate and revoke the old refresh token (rotation).
- **POST /auth/logout** – Revoke refresh token (body: `refreshToken`) → returns `{ revoked: boolean }`
- **GET /auth/me** – Current user (header: `Authorization: Bearer <token>`)

Access tokens are short-lived (e.g. 15m); refresh tokens are long-lived (e.g. 7d) and stored in Redis. All other routes require a valid JWT unless marked with `@Public()`.

## Health

- **GET /health** – Readiness (DB + Redis)
- **GET /health/live** – Liveness (`{ status: 'ok' }`)

## Workers

Bull is configured with a `default` queue. Use `WorkersService.addJob()` to enqueue jobs and add processors in `workers/` when you implement background tasks (e.g. email, notifications).

## Scripts

- `npm run start` – Start
- `npm run start:dev` – Start with watch
- `npm run build` – Build
- `npm run start:prod` – Run production build
- `npm run migration:generate -- src/migrations/Name` – Generate migration
- `npm run migration:run` – Run migrations
- `npm run migration:revert` – Revert last migration
- `npm run lint` – Lint
- `npm run test` – Unit tests
- `npm run test:e2e` – E2E tests

## Optional steps (future)

Ideas to add later:

- **Rate limiting** – e.g. `@nestjs/throttler` on auth routes (`/auth/login`, `/auth/register`) to limit attempts.
- **Swagger / OpenAPI** – `@nestjs/swagger` for interactive API docs at e.g. `/api` or `/docs`.
- **Global API prefix** – `app.setGlobalPrefix('api')` in `main.ts` so all routes live under `/api` (e.g. `/api/auth/login`). Update frontend `NEXT_PUBLIC_API_URL` to include `/api` if you add this.
- **Config validation** – Use `env.validation.ts` (or similar) with `ConfigModule.forRoot({ validate: validate })` so the app fails fast on invalid or missing env vars.
- **Stricter JWT** – In production, require `JWT_SECRET` (fail startup if missing) and consider refresh tokens + short-lived access tokens.
