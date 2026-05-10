"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { routes } from "@/lib/routes";

export function Nav() {
  const { isAuthenticated, user, logout, isInitialized } = useAuth();

  return (
    <nav className="border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href={routes.home}
            className="font-semibold text-zinc-900 dark:text-zinc-100"
          >
            Forge
          </Link>
          <Link
            href={routes.public}
            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Public
          </Link>
          {isAuthenticated && (
            <Link
              href={routes.dashboard}
              className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Dashboard
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          {isInitialized &&
            (isAuthenticated ? (
              <>
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  {user?.email}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href={routes.login}
                  className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Sign in
                </Link>
                <Link
                  href={routes.register}
                  className="rounded bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  Register
                </Link>
              </>
            ))}
        </div>
      </div>
    </nav>
  );
}
