import { requireAdmin } from "@/lib/auth/admin-guard";

export default async function AdminLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   await requireAdmin();
   return (
      <>
         {children}
      </>
   );
}
