# Forge Frontend

Next.js app for **Forge**, with Tailwind CSS.

## Stack

- **Next.js** (latest) – React framework, App Router
- **Tailwind CSS** (latest) – Styling
- **TypeScript** – Type safety

## Prerequisites

- Node.js 20+

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to your backend URL:

   ```bash
   cp .env.example .env.local
   ```

3. **Run**

   ```bash
   # Development
   npm run dev

   # Production build
   npm run build
   npm run start
   ```

Open [http://localhost:3000](http://localhost:3000) (or the port shown in the terminal).

## Auth

Auth is wired to the Forge backend (JWT). Set `NEXT_PUBLIC_API_URL` in `.env.local` to the backend base URL (e.g. `http://localhost:3000`).

- **Public route:** `/public` – no sign-in required
- **Sign in / Register:** `/login`, `/register`
- **Protected:** `/dashboard` – requires sign-in; redirects to `/login` otherwise
- Token is stored in `localStorage` and sent as `Authorization: Bearer <token>` to the API

## Project structure

- `src/app/` – App Router pages and layout
- `src/context/auth-context.tsx` – Auth state and provider
- `src/lib/api.ts` – API client and auth endpoints
- `src/components/` – Nav
- `public/` – Static assets

## Notes

- **npm deprecation warnings (inflight, glob, rimraf, cross-spawn-async):** If you see these when running `npx @next/codemod`, they come from the codemod’s dependencies, not from this project. This app’s dependency tree does not include them; you can safely ignore the warnings.

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run start` – Run production server
- `npm run lint` – Lint
