/**
 * Centralized route paths. Use these in middleware, redirects, and links
 * so path changes are in one place.
 */
export const routes = {
  home: "/",
  public: "/public",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
} as const;

export type RoutePath = (typeof routes)[keyof typeof routes];
