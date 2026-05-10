import { getApiUrl } from "@/lib/config/api";
import {
  getStoredRefreshToken,
  setStoredRefreshToken,
  setStoredToken,
} from "@/lib/storage/tokens";
import type { AuthResponse } from "@/types/auth";

function buildUrl(path: string): string {
  return `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

async function parseErrorResponse(res: Response): Promise<Error> {
  const body = await res.text();
  let message = body;
  try {
    const json = JSON.parse(body);
    message = json.message ?? json.error ?? body;
  } catch {
    // use body as message
  }
  return new Error(message || `Request failed: ${res.status}`);
}

async function parseResponse<T>(res: Response): Promise<T> {
  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

/**
 * Request without Authorization and without 401 retry.
 * Use for login, register, refresh, logout.
 */
export async function rawRequest<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const url = buildUrl(path);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    throw await parseErrorResponse(res);
  }
  return parseResponse<T>(res);
}

export interface RequestOptions {
  token?: string | null;
  /** When true (e.g. SSR), do not attempt 401 refresh; just throw. */
  skipRefresh?: boolean;
}

/**
 * Request with optional Bearer token. On 401, attempts refresh once (unless skipRefresh),
 * stores new tokens in cookies, then retries the request.
 */
export async function request<T>(
  path: string,
  init: RequestInit = {},
  options: RequestOptions = {}
): Promise<T> {
  const { token, skipRefresh = false } = options;
  const url = buildUrl(path);
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401 && token && !skipRefresh) {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) {
      throw await parseErrorResponse(res);
    }
    try {
      const authRes = await rawRequest<AuthResponse>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      });
      setStoredToken(authRes.accessToken);
      setStoredRefreshToken(authRes.refreshToken);
      // Retry once with new access token
      const retryHeaders: HeadersInit = {
        ...headers,
        Authorization: `Bearer ${authRes.accessToken}`,
      };
      const retryRes = await fetch(url, { ...init, headers: retryHeaders });
      if (!retryRes.ok) {
        throw await parseErrorResponse(retryRes);
      }
      return parseResponse<T>(retryRes);
    } catch {
      throw await parseErrorResponse(res);
    }
  }

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }
  return parseResponse<T>(res);
}

export { getApiUrl };
