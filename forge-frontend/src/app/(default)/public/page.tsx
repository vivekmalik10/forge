import Link from "next/link";
import { routes } from "@/lib/routes";

export default function PublicPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Public route
      </h1>
      <p className="max-w-md text-center text-zinc-500 dark:text-zinc-400">
        This page is accessible without signing in. Use it for landing content,
        docs, or any public information.
      </p>
      <div className="flex gap-4">
        <Link
          href={routes.home}
          className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
        >
          Home
        </Link>
        <Link
          href={routes.login}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
