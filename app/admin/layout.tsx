import { requireAdmin } from "@/lib/auth/admin-guard";

export default async function AdminLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   await requireAdmin();

   return (
      <div className="min-h-screen bg-background">
         <div className="border-b">
            <div className="container mx-auto px-4 py-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
                        ← Back to Store
                     </a>
                     <div className="h-4 w-px bg-border" />
                     <h2 className="text-lg font-semibold">Admin Panel</h2>
                  </div>
                  <nav className="flex gap-4">
                     <a
                        href="/admin"
                        className="text-sm hover:text-primary transition-colors"
                     >
                        Dashboard
                     </a>
                     <a
                        href="/admin/products"
                        className="text-sm hover:text-primary transition-colors"
                     >
                        Products
                     </a>
                     <a
                        href="/admin/orders"
                        className="text-sm hover:text-primary transition-colors"
                     >
                        Orders
                     </a>
                     <a
                        href="/admin/users"
                        className="text-sm hover:text-primary transition-colors"
                     >
                        Users
                     </a>
                  </nav>
               </div>
            </div>
         </div>
         {children}
      </div>
   );
}
