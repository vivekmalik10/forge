"use client";

import { useEffect } from "react";
import Link from "next/link";
import { routes } from "@/lib/routes";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to reporting service in production
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-xl font-semibold text-red-600 dark:text-red-400">
        Something went wrong
      </h1>
      <p className="mb-4 text-zinc-600 dark:text-zinc-400">
        We couldn’t load the dashboard. You can try again or go back home.
      </p>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Try again
        </button>
        <Link
          href={routes.home}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
