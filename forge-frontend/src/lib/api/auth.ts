import { rawRequest, request } from "@/lib/api/client";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "@/types/auth";

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return rawRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return rawRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  async me(
    token: string,
    options?: { skipRefresh?: boolean }
  ): Promise<AuthResponse> {
    return request<AuthResponse>("/auth/me", {}, { token, skipRefresh: options?.skipRefresh });
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    return rawRequest<AuthResponse>("/auth/refresh", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },

  async logout(refreshToken: string): Promise<{ revoked: boolean }> {
    return rawRequest<{ revoked: boolean }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  },
};
