# Hexa Shop — AI Agent Instructions

Concise guidance for coding agents to be productive immediately.

## Architecture

- Next.js 15 App Router with React 19 and TypeScript. Styled via Tailwind and shadcn/ui. Auth via Supabase cookies.
- Root layout `app/(root)/layout.tsx` wraps pages with `components/home/navbar.tsx`.
- Admin area under `app/(root)/admin/*` guarded by role checks in `lib/auth/admin-guard.ts` and `lib/auth/roles.ts`.

## Auth (critical)

- Client components use `@/lib/supabase/client` → `const supabase = createClient()`.
- Server components, route handlers, server actions use `@/lib/supabase/server` → `const supabase = await createClient()`.
- Do not store server clients globally; instantiate per request.
- Middleware proxy: `proxy.ts` + `lib/supabase/proxy.ts` must call `getClaims()` and set cookies on request/response. Redirect unauthenticated users to `/auth`. Matcher excludes `_next/static`, `_next/image`, `favicon.ico`, image files.
- Email confirmation flow: `components/auth/sign-up-form.tsx` sets `emailRedirectTo` → `app/auth/confirm/route.ts` verifies via `supabase.auth.verifyOtp()` and redirects to `next`.

## Patterns & Conventions

- Page–Form split for auth: page `app/auth/page.tsx` manages tabs; forms in `components/auth/*` are client components with controlled inputs and inline error display.
- `@/*` path alias for imports. Use `cn()` from `lib/utils.ts` for class merging.
- Strict TypeScript; React 19 (no `import React`). Client components require `"use client"` directive.
- Theme variables in `app/globals.css` (primary `#c96442`, background `#faf9f5`). shadcn style: `components.json` set to "new-york" with lucide icons.

## Admin

- Sidebar `components/admin/app-sidebar.tsx`. Pages: `customers`, `orders`, `products` under `app/(root)/admin/*`.
- Protect admin routes with `admin-guard.ts` server utilities. Enforce roles from `lib/auth/roles.ts`.

## Commands

- `pnpm dev` — start on `localhost:3000`.
- `pnpm build && pnpm start` — production test.
- `pnpm lint` — Next.js ESLint.
- `pnpm dlx shadcn@latest add <name>` — install UI primitives to `components/ui/`.

## Env Vars

- `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`.
- `lib/utils.ts` exports `hasEnvVars` to optionally skip auth check in `proxy.ts` during setup.

## Gotchas

- Keep `getClaims()` in proxy; removing causes silent logouts.
- Preserve cookie handling and `setAll` try/catch in `lib/supabase/server.ts`.
- Auth redirect defaults to `/` in forms; update if protected target changes.
- Maintain middleware matcher static asset exclusions when editing.

## Component Usage

- shadcn components under `components/ui/*` with CVA variants. Example: `<Button variant="outline" size="lg">…</Button>`.

Refer to `README.md` for generic Supabase starter context; this repo customizes theme, auth pages, and admin guard.
