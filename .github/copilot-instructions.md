# Hexa Shop - AI Agent Instructions

## Project Overview

Next.js 15 e-commerce application for men's products using App Router, React 19, TypeScript, Supabase authentication, and shadcn/ui components. Built with pnpm and styled with Tailwind CSS using a custom warm color palette.

## Architecture & Key Patterns

### Supabase Authentication Flow (CRITICAL)

**Three distinct client patterns** - use the correct one for context:

```typescript
// Client Components (forms, interactive UI)
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Server Components, Route Handlers, Server Actions
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient(); // async!
```

**NEVER store server clients in global variables** - Fluid compute requires per-request instantiation.

**Authentication middleware** (`proxy.ts` + `lib/supabase/proxy.ts`):

- `getClaims()` call is mandatory - removing it causes random logouts
- Cookie handling in both request/response - see `lib/supabase/proxy.ts` lines 28-39
- Redirects unauthenticated users to `/auth` (except `/auth/*` paths)
- Matcher excludes: `_next/static`, `_next/image`, `favicon.ico`, images (`.svg|png|jpg|jpeg|gif|webp`)

### Authentication Implementation Pattern

**Page-Form separation** enforced across all auth flows:

- Page: `app/auth/page.tsx` (unified login/signup with tabs via `?tab=` query param)
- Forms: `components/auth/login-form.tsx`, `sign-up-form.tsx` (client components)
- Pattern: Controlled inputs + React state + inline error display + router navigation

**Email verification flow**:

1. Signup → `emailRedirectTo: /auth/confirm?next=<path>`
2. User clicks email link → `GET /auth/confirm` route handler
3. Verifies OTP via `supabase.auth.verifyOtp()` → redirects to `next` param

### File Organization

```
app/
  (root)/           # Route group with Navbar layout
    layout.tsx      # Wraps pages with <Navbar />
    page.tsx        # Homepage
  auth/
    page.tsx        # Unified login/signup with Tabs
    callback/       # OAuth callback handler
    confirm/        # Email verification handler
    forgot-password/
    update-password/
components/
  auth/             # All 7 auth forms (login, signup, forgot-password, etc.)
  home/             # Feature components (navbar)
  ui/               # shadcn/ui primitives (13 components installed)
lib/
  supabase/         # Three client factories + proxy logic
  utils.ts          # cn() helper + hasEnvVars check
```

**Path aliases**: `@/*` → project root (all imports use this)

### Styling System

**Custom theme** in `app/globals.css`:

- Primary: `#c96442` (terracotta)
- Background: `#faf9f5` (warm cream)
- Variables: `--primary`, `--background`, etc. (Tailwind reads via `var()`)

**shadcn/ui config** (`components.json`):

- Style: "new-york" (denser spacing, smaller text)
- Base color: "neutral"
- Icons: lucide-react
- All components use CVA for variants + `cn()` for className merging

**Example component usage**:

```tsx
<Button variant="outline" size="lg">
  Click Me
</Button>
// variants: default | destructive | outline | secondary | ghost | link
// sizes: default | sm | lg | icon
```

## Development Workflow

### Commands

```bash
pnpm dev                           # localhost:3000
pnpm build && pnpm start           # Production test
pnpm lint                          # ESLint (Next.js config)
pnpm dlx shadcn@latest add <name>  # Install UI component
```

### Adding Components

1. **shadcn/ui**: `pnpm dlx shadcn@latest add button` → auto-installs to `components/ui/`
2. **Custom components**: Group by feature (`components/auth/`, `components/home/`)
3. **Always use `@/` alias** for imports

### Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL` (for metadata + email redirects)

Validation: `lib/utils.ts` exports `hasEnvVars` boolean (used in proxy.ts to skip auth check during setup)

## Key Conventions

- **TypeScript strict mode** - no implicit any, strict null checks
- **React 19** - JSX transform enabled (no `import React` needed)
- **No emojis in UI** unless specified
- **next-themes** configured but light theme primary
- **Geist font** via `next/font/google` in root layout
- **Client components** must have `"use client"` directive at top (all auth forms, interactive components)
- **Server components** are default - use for layouts, static pages

## Critical Gotchas

1. **Proxy middleware `getClaims()` is non-negotiable** - removing causes silent session expiration
2. **Server client cookie handling** - never simplify `lib/supabase/server.ts` setAll try/catch (see comment lines 18-23)
3. **Auth redirect target** - currently hardcoded to `/` in forms, update if protected route changes
4. **Middleware matcher** - modify carefully, must maintain static asset exclusions
5. **Email confirmation** - `emailRedirectTo` must include `NEXT_PUBLIC_BASE_URL` as base (see `sign-up-form.tsx` line 38)

## Component Reference

**Installed shadcn/ui components**: Badge, Button, Card, Carousel, Checkbox, Dialog, Dropdown Menu, Field, Input, Label, Select, Separator, Skeleton, Sonner (toast), Spinner, Tabs

**Auth components**: auth-button, google-auth-button, login-form, logout-button, sign-up-form, forgot-password-form, update-password-form
