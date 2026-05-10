"use client";

import { useAuth } from "@/context/auth-context";

export function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        You are signed in as <strong>{user?.email}</strong>
        {user?.name && <> ({user.name})</>}.
      </p>
      <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="mb-2 font-medium">Profile</h2>
        <dl className="space-y-1 text-sm">
          <div>
            <dt className="text-zinc-500">ID</dt>
            <dd className="font-mono text-zinc-900 dark:text-zinc-100">
              {user?.id}
            </dd>
          </div>
          <div>
            <dt className="text-zinc-500">Email</dt>
            <dd>{user?.email}</dd>
          </div>
          {user?.name && (
            <div>
              <dt className="text-zinc-500">Name</dt>
              <dd>{user.name}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
