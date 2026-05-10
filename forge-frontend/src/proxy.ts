import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { routes, type RoutePath } from "@/lib/routes";
import { ACCESS_TOKEN_COOKIE } from "@/lib/storage/tokens";

const PUBLIC_PATHS: readonly RoutePath[] = [routes.public];
const GUEST_ONLY_PATHS: readonly RoutePath[] = [routes.login, routes.register];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname as RoutePath);
}

function isProtectedPath(pathname: string): boolean {
  return !isPublicPath(pathname) && !isGuestOnlyPath(pathname);
}

function isGuestOnlyPath(pathname: string): boolean {
  return GUEST_ONLY_PATHS.includes(pathname as RoutePath);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log("pathname", pathname);
  const hasSession =
    request.cookies.get(ACCESS_TOKEN_COOKIE)?.value != null;

  if (isProtectedPath(pathname)) {
    if (!hasSession) {
      const loginUrl = new URL(routes.login, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (isGuestOnlyPath(pathname) && hasSession) {
    return NextResponse.redirect(new URL(routes.home, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};
