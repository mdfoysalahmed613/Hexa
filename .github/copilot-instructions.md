# Hexa Shop - AI Agent Instructions

## Project Overview

Next.js 15 e-commerce application for men's products using App Router, React 19, TypeScript, Supabase authentication, and shadcn/ui components. Built with pnpm and styled with Tailwind CSS using a custom warm color palette.

## Architecture & Key Patterns

### Supabase Authentication Flow

- **Three client patterns** based on context:
  - `lib/supabase/client.ts`: Browser-side (`createBrowserClient`) - use in Client Components
  - `lib/supabase/server.ts`: Server-side (`createServerClient`) - use in Server Components, Route Handlers, Server Actions
  - `lib/supabase/proxy.ts`: Middleware proxy for session management
- **Critical**: Always create new server clients per-request (Fluid compute requirement) - never store in global variables
- **Authentication middleware** (`proxy.ts` + `lib/supabase/proxy.ts`): Handles session refresh, protects routes, redirects unauthenticated users to `/auth/login`
- All auth forms are in `components/auth/` and use client-side Supabase client with router-based navigation

### File Organization

- **App routes**: `app/` - Next.js 15 App Router structure
- **UI components**: `components/ui/` - shadcn/ui components (New York style)
- **Business components**: `components/auth/` - feature-specific components
- **Utilities**: `lib/utils.ts` exports `cn()` helper for className merging
- **Path aliases**: `@/*` maps to project root (configured in `tsconfig.json`)

### Styling System

- **Custom theme** defined in `app/globals.css` with warm earth tones:
  - Primary: `#c96442` (terracotta orange)
  - Background: `#faf9f5` (warm cream)
  - Neutral palette with muted greens/browns
- **shadcn/ui configuration** (`components.json`):
  - Style: "new-york"
  - Base color: "neutral"
  - CSS variables enabled
  - Icons: lucide-react
- Use `cn()` utility from `@/lib/utils` for conditional classes

### Component Patterns

- **shadcn/ui components**: Use Radix UI primitives with CVA variants
  - Example: `Button` component has `variant` (default, destructive, outline, secondary, ghost, link) and `size` props
  - Import from `@/components/ui/*`
- **Client Components**: Mark with `"use client"` directive (all auth forms, interactive components)
- **Server Components**: Default - use for layouts, static pages

## Development Workflow

### Package Management

```bash
pnpm dev          # Start dev server (localhost:3000)
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint check
pnpm dlx shadcn@latest add <component>  # Add shadcn/ui components
```

### Adding New Components

1. **shadcn/ui components**: Use `pnpm dlx shadcn@latest add <name>` - auto-installs to `components/ui/`
2. **Custom components**: Create in `components/` with appropriate subdirectory
3. Import using `@/components/*` alias

### Authentication Implementation

- Auth pages follow pattern: page in `app/auth/[feature]/page.tsx` wraps form from `components/auth/[feature]-form.tsx`
- Forms use controlled inputs with React state, handle errors with toast/inline messages
- Email confirmation flow uses route handler at `app/auth/confirm/route.ts`
- Protected routes require middleware check - see `proxy.ts` matcher config

### Supabase Client Usage

```typescript
// Client Component
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// Server Component/Route Handler/Server Action
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient(); // Note: async!
```

## Environment Setup

Required variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_BASE_URL` (for metadata)

Check `lib/utils.ts` `hasEnvVars` export for environment validation.

## Key Conventions

- **TypeScript strict mode** enabled
- **React 19** with JSX transform (no React import needed)
- **Geist font** loaded in root layout
- **Theme system**: next-themes with system detection, class-based dark mode (configured but light theme primary)
- **Middleware matcher**: Excludes static assets, images, Next.js internals (see `proxy.ts` config)
- **ESLint**: Uses Next.js recommended config with TypeScript support

## Critical Notes

- Session handling requires `getClaims()` call in proxy - don't remove or users get logged out
- Cookie handling in server client is complex - see `lib/supabase/server.ts` pattern
- Proxy middleware runs on all matched routes - modify matcher carefully
- When redirecting after auth, update target route in forms (currently `/protected`)
