/**
 * API and token helpers. Tokens are stored in cookies for SSR.
 *
 * SSR example (Server Component or Server Action):
 *   import { cookies } from "next/headers";
 *   import { authApi, getStoredTokenFromCookies } from "@/lib/api";
 *   const token = getStoredTokenFromCookies(cookies());
 *   const user = token ? await authApi.me(token, { skipRefresh: true }) : null;
 */
export { authApi } from "@/lib/api/auth";
export { getApiUrl as getApiBaseUrl } from "@/lib/api/client";
export {
  getStoredToken,
  setStoredToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
  getStoredTokenFromCookies,
  getStoredRefreshTokenFromCookies,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/storage/tokens";
