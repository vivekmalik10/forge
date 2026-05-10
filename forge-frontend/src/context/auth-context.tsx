"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  authApi,
  getStoredToken,
  setStoredToken,
  getStoredRefreshToken,
  setStoredRefreshToken,
} from "@/lib/api";
import { routes } from "@/lib/routes";
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials, redirectTo?: string) => Promise<void>;
  register: (credentials: RegisterCredentials, redirectTo?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

function isAllowedRedirect(path: string): boolean {
  return path.startsWith(routes.dashboard) && !path.startsWith(routes.login) && !path.startsWith(routes.register);
}

const AuthContext = createContext<AuthContextValue | null>(null);

function applyAuthResponse(res: AuthResponse, setState: React.Dispatch<React.SetStateAction<AuthState>>) {
  setStoredToken(res.accessToken);
  setStoredRefreshToken(res.refreshToken);
  setState((s) => ({
    ...s,
    user: res.user,
    token: res.accessToken,
    isLoading: false,
  }));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,
  });

  const loadUser = useCallback(async (token: string) => {
    try {
      const res = await authApi.me(token);
      setStoredToken(res.accessToken);
      setStoredRefreshToken(res.refreshToken);
      setState((s) => ({
        ...s,
        user: res.user,
        token: res.accessToken,
        isInitialized: true,
      }));
    } catch {
      const refreshToken = getStoredRefreshToken();
      if (refreshToken) {
        try {
          const res = await authApi.refresh(refreshToken);
          applyAuthResponse(res, setState);
          setState((s) => ({ ...s, isInitialized: true }));
          return;
        } catch {
          setStoredRefreshToken(null);
        }
      }
      setStoredToken(null);
      setState((s) => ({
        ...s,
        user: null,
        token: null,
        isInitialized: true,
      }));
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setState((s) => ({ ...s, token }));
      loadUser(token).catch(() => {});
    } else {
      setState((s) => ({ ...s, isInitialized: true }));
    }
  }, [loadUser]);

  const login = useCallback(
    async (credentials: LoginCredentials, redirectTo?: string) => {
      setState((s) => ({ ...s, isLoading: true }));
      try {
        const res: AuthResponse = await authApi.login(credentials);
        applyAuthResponse(res, setState);
        const target = redirectTo && isAllowedRedirect(redirectTo) ? redirectTo : routes.dashboard;
        router.push(target);
      } catch (err) {
        setState((s) => ({ ...s, isLoading: false }));
        throw err;
      }
    },
    [router]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials, redirectTo?: string) => {
      setState((s) => ({ ...s, isLoading: true }));
      try {
        const res: AuthResponse = await authApi.register(credentials);
        applyAuthResponse(res, setState);
        const target = redirectTo && isAllowedRedirect(redirectTo) ? redirectTo : routes.dashboard;
        router.push(target);
      } catch (err) {
        setState((s) => ({ ...s, isLoading: false }));
        throw err;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    const refreshToken = getStoredRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // ignore
      }
      setStoredRefreshToken(null);
    }
    setStoredToken(null);
    setState({
      user: null,
      token: null,
      isLoading: false,
      isInitialized: true,
    });
    router.push(routes.home);
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      isAuthenticated: !!state.token && !!state.user,
    }),
    [state, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
