/**
 * Strict validation for required env vars. Throws on first load if any are missing.
 * No code defaults for secrets, URLs, or expiry – they must be set in .env.
 */

const REQUIRED = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
] as const;

function getEnv(name: string): string | undefined {
  const v = process.env[name];
  return v === '' ? undefined : v;
}

export function requireEnv(name: string): string {
  const v = getEnv(name);
  if (v === undefined) {
    throw new Error(`Missing required env: ${name}. Set it in .env (see .env.example).`);
  }
  return v;
}

/**
 * Redis: either REDIS_URL or both REDIS_HOST and REDIS_PORT must be set.
 */
export function requireRedisConfig(): void {
  const url = getEnv('REDIS_URL');
  const host = getEnv('REDIS_HOST');
  const port = getEnv('REDIS_PORT');
  if (url) return;
  if (host && port) return;
  throw new Error(
    'Missing required Redis config: set REDIS_URL, or both REDIS_HOST and REDIS_PORT in .env (see .env.example).',
  );
}

let validated = false;

export function validateEnv(): void {
  if (validated) return;
  for (const name of REQUIRED) {
    requireEnv(name);
  }
  requireRedisConfig();
  validated = true;
}
