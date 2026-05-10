/**
 * Token storage in cookies so both client and server can read them (SSR).
 * Cookie names are exported for middleware and server (cookies().get(ACCESS_TOKEN_COOKIE)).
 */

export const ACCESS_TOKEN_COOKIE = "access_token";
export const REFRESH_TOKEN_COOKIE = "refresh_token";

const ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60; // 1 hour
const REFRESH_TOKEN_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAge: number): void {
  if (typeof document === "undefined") return;
  const secure = window.location?.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

function clearCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Path=/; Max-Age=0`;
}

export function getStoredToken(): string | null {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function setStoredToken(token: string | null): void {
  if (token) setCookie(ACCESS_TOKEN_COOKIE, token, ACCESS_TOKEN_MAX_AGE_SECONDS);
  else clearCookie(ACCESS_TOKEN_COOKIE);
}

export function getStoredRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

export function setStoredRefreshToken(token: string | null): void {
  if (token) setCookie(REFRESH_TOKEN_COOKIE, token, REFRESH_TOKEN_MAX_AGE_SECONDS);
  else clearCookie(REFRESH_TOKEN_COOKIE);
}

/**
 * Server/SSR: get access token from Next.js cookies().
 * Usage: cookies().get(ACCESS_TOKEN_COOKIE)?.value
 * Or pass the cookie store: getStoredTokenFromCookies(cookies())
 */
export function getStoredTokenFromCookies(
  cookieStore: { get(name: string): { value: string } | undefined }
): string | null {
  return cookieStore.get(ACCESS_TOKEN_COOKIE)?.value ?? null;
}

export function getStoredRefreshTokenFromCookies(
  cookieStore: { get(name: string): { value: string } | undefined }
): string | null {
  return cookieStore.get(REFRESH_TOKEN_COOKIE)?.value ?? null;
}
