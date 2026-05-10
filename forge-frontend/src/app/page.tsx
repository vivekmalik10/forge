import Link from "next/link";
import { routes } from "@/lib/routes";

export default function Home() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4">
      <h1 className="text-4xl font-bold tracking-tight">Forge</h1>
      <p className="max-w-md text-center text-zinc-600 dark:text-zinc-400">
        Welcome. Sign in or browse the public route.
      </p>
      <div className="flex gap-4">
        <Link
          href={routes.public}
          className="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
        >
          Public
        </Link>
        <Link
          href={routes.login}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Sign in
        </Link>
        <Link
          href={routes.dashboard}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
