# Hexa Shop - AI Agent Instructions

## Project Overview

Next.js 16 (Turbopack) e-commerce application for men's products using App Router, React 19, TypeScript, Supabase authentication, and shadcn/ui components. Built with pnpm and styled with Tailwind CSS using a custom warm color palette.

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

- `getClaims()` call is **mandatory** - removing it causes random logouts
- Cookie handling in both request/response - see `lib/supabase/proxy.ts` lines 28-39
- Redirects unauthenticated users to `/auth` (except `/auth/*` paths)
- **Admin route protection**: `/admin/*` checks for `app_metadata.role === "admin"` and redirects non-admins to `/`
- Matcher excludes: `_next/static`, `_next/image`, `favicon.ico`, images (`.svg|png|jpg|jpeg|gif|webp`)

### Admin System (Role-Based Access)

**Role assignment** (see `ADMIN_SETUP.md`):

- Admin role stored in `user_metadata.role` or `app_metadata.role`
- Assign via Supabase SQL: `UPDATE auth.users SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb WHERE email = 'user@example.com';`
- User must logout/login after role change

**Admin guards**:

- **Server-side**: `requireAdmin()` from `lib/auth/admin-guard.ts` (use in page components, redirects if not admin)
- **Client-side**: `isAdmin(user)` from `lib/auth/roles.ts` (for UI conditional rendering)
- **Middleware**: `lib/supabase/proxy.ts` checks admin role on `/admin/*` routes

**Admin pages structure**:

```
app/admin/
  layout.tsx        # requireAdmin() + nav bar (Dashboard, Products, Orders, Users)
  page.tsx          # Dashboard with stats cards and quick actions
```

**Admin UI features**:

- `auth-button.tsx` shows "Admin" badge and "Admin Dashboard" menu item for admin users
- Admin layout includes "Back to Store" link and simplified navigation
- Dashboard shows mock stats (users, products, orders, revenue) - replace with real data

### Authentication Implementation Pattern

**Page-Form separation** enforced across all auth flows:

- Page: `app/auth/page.tsx` (unified login/signup with tabs via `?tab=` query param)
- Forms: `components/auth/login-form.tsx`, `sign-up-form.tsx` (client components)
- Pattern: Controlled inputs + React state + inline error display + router navigation

**Email verification flow**:

1. Signup → `emailRedirectTo: /auth/confirm?next=<path>`
2. User clicks email link → `GET /auth/confirm` route handler
3. Verifies OTP via `supabase.auth.verifyOtp()` → redirects to `next` param

**Profile editing**: `edit-profile-dialog.tsx` updates `full_name`, `avatar_url`, `phone` via `supabase.auth.updateUser()`

### File Organization

```
app/
  (root)/           # Route group with Navbar layout
    layout.tsx      # Wraps pages with <Navbar />
    page.tsx        # Homepage with HeroSection
  admin/            # Admin panel (protected)
    layout.tsx      # requireAdmin() guard + admin nav
    page.tsx        # Dashboard
  auth/             # Auth pages
    page.tsx        # Unified login/signup with Tabs
    callback/       # OAuth callback handler
    confirm/        # Email verification handler
    forgot-password/, update-password/, error/, sign-up-success/
components/
  auth/             # Auth forms + auth-button with admin UI
  home/             # hero-section, navbar
  ui/               # shadcn/ui primitives (20+ components)
lib/
  auth/             # admin-guard, roles helpers
  supabase/         # client, server, proxy
  utils.ts          # cn() helper + hasEnvVars check
assets/common/      # Images (logo, hero, categories)
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

**Toast notifications**: Import `toast` from `sonner`, `<Toaster />` in root layout

```tsx
import { toast } from "sonner";
toast.success("Success message");
toast.error("Error message");
```

## Development Workflow

### Commands

```bash
pnpm dev                           # localhost:3000 (Turbopack)
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
- **Client components** must have `"use client"` directive at top (all auth forms, interactive components, navbar)
- **Server components** are default - use for layouts, static pages, admin pages
- **Navigation**: Use `<Link href="...">` from `next/link` for internal links, `<a href="...">` only in admin layout
- **Images**: Use `<Image>` from `next/image` with `fill` prop for responsive images

## Critical Gotchas

1. **Proxy middleware `getClaims()` is non-negotiable** - removing causes silent session expiration
2. **Server client cookie handling** - never simplify `lib/supabase/server.ts` setAll try/catch (see comment lines 18-23)
3. **Auth redirect target** - currently hardcoded to `/` in forms, update if protected route changes
4. **Middleware matcher** - modify carefully, must maintain static asset exclusions
5. **Email confirmation** - `emailRedirectTo` must include `NEXT_PUBLIC_BASE_URL` as base (see `sign-up-form.tsx` line 38)
6. **Admin role** - stored in `app_metadata.role`, not `user_metadata.role` (middleware checks `app_metadata` first)
7. **Sidebar component** - complex state management, avoid editing unless necessary (causes Fast Refresh full reloads)

## Component Reference

**Installed shadcn/ui components**: Avatar, Badge, Button, Card, Carousel, Checkbox, Dialog, Dropdown Menu, Field, Hover Card, Input, Label, Select, Separator, Sheet, Sidebar, Skeleton, Sonner (toast), Spinner, Tabs, Tooltip

**Auth components**: auth-button (with admin UI), edit-profile-dialog, google-auth-button, login-form, sign-up-form, forgot-password-form, update-password-form

**Home components**: navbar (with mobile search), hero-section (with category cards)

**Admin components**: Layout in `app/admin/layout.tsx`, Dashboard in `app/admin/page.tsx` (more pages TBD)

## Next Steps / TODO

- Implement product management pages (`/admin/products`)
- Implement order management pages (`/admin/orders`)
- Implement user management pages (`/admin/users`)
- Connect admin dashboard to real database tables
- Add product listing pages (`/products`)
- Add cart functionality (`/cart`)
- Add Supabase database schema and migrations
