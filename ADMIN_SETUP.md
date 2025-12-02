# Admin Role Setup Guide

## How to Make a User Admin

### Method 1: Using Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run this SQL to make a user admin:

```sql
-- Replace 'user@example.com' with the actual user's email
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'user@example.com';
```

4. The user needs to log out and log back in for the role to take effect

### Method 2: Using Supabase Dashboard

1. Go to **Authentication** → **Users** in Supabase Dashboard
2. Click on the user you want to make admin
3. Scroll to **User Metadata** section
4. Add/Edit the JSON:

```json
{
  "role": "admin"
}
```

5. Save changes

### Method 3: Programmatically (Server-Side)

Create an admin API route that only you can access:

```typescript
// app/api/admin/make-admin/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, secret } = await request.json();

  // Use a strong secret key (store in .env)
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();

  // This requires service_role key, not the public key
  // You need to use the service role key for this
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role: "admin" },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
```

## Admin Features

### Access Control

- **Client-side check**: `isAdmin(user)` function in `lib/auth/roles.ts`
- **Server-side guard**: `requireAdmin()` function in `lib/auth/admin-guard.ts`
- **Middleware protection**: Admin routes (`/admin/*`) are protected in proxy middleware

### Admin Dashboard

Access at: `/admin`

Features:

- Statistics overview (users, products, orders, revenue)
- Quick actions menu
- Navigation to admin sections

### Admin Routes

All admin routes are automatically protected:

- `/admin` - Dashboard
- `/admin/products` - Product management (to be implemented)
- `/admin/orders` - Order management (to be implemented)
- `/admin/users` - User management (to be implemented)

### User Menu

Admin users will see:

- "Admin" badge in dropdown
- "Admin Dashboard" menu item with shield icon

## Testing

1. Create a test user account
2. Make them admin using Method 1 or 2
3. Log out and log back in
4. You should see "Admin" badge and "Admin Dashboard" option
5. Visit `/admin` to access the dashboard

## Security Notes

- Admin role is stored in `user_metadata.role`
- All admin routes are protected by middleware
- Server-side checks use `requireAdmin()` guard
- Non-admin users are redirected to homepage if they try to access `/admin`

## Next Steps

To fully implement admin functionality:

1. Create product management pages
2. Implement order management system
3. Add user management interface
4. Connect to your database tables
5. Add admin API routes for CRUD operations
