import { User } from "@supabase/supabase-js";

/**
 * Check if user has admin role
 * Admin role is stored in user_metadata.role
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.app_metadata?.role === "admin" || user.user_metadata?.role === "admin";
}

/**
 * Get user role from user metadata
 */
export function getUserRole(user: User | null): string {
  if (!user) return "guest";
  return user.app_metadata?.role || "user";
}
