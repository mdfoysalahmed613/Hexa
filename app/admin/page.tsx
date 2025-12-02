import { requireAdmin } from "@/lib/auth/admin-guard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
   await requireAdmin();

   // Mock stats - replace with real data from your database
   const stats = [
      {
         title: "Total Users",
         value: "1,234",
         icon: Users,
         description: "+12% from last month",
      },
      {
         title: "Total Products",
         value: "567",
         icon: Package,
         description: "89 in stock",
      },
      {
         title: "Total Orders",
         value: "892",
         icon: ShoppingCart,
         description: "+8% from last month",
      },
      {
         title: "Revenue",
         value: "$45,231",
         icon: DollarSign,
         description: "+23% from last month",
      },
   ];

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
               Manage your e-commerce store
            </p>
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
               <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        {stat.title}
                     </CardTitle>
                     <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{stat.value}</div>
                     <p className="text-xs text-muted-foreground">
                        {stat.description}
                     </p>
                  </CardContent>
               </Card>
            ))}
         </div>

         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
               <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <a
                     href="/admin/products"
                     className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                     <div className="font-medium">Manage Products</div>
                     <div className="text-sm text-muted-foreground">
                        Add, edit, or remove products
                     </div>
                  </a>
                  <a
                     href="/admin/orders"
                     className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                     <div className="font-medium">View Orders</div>
                     <div className="text-sm text-muted-foreground">
                        Process customer orders
                     </div>
                  </a>
                  <a
                     href="/admin/users"
                     className="block p-3 rounded-lg hover:bg-accent transition-colors"
                  >
                     <div className="font-medium">Manage Users</div>
                     <div className="text-sm text-muted-foreground">
                        View and manage user accounts
                     </div>
                  </a>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-sm text-muted-foreground">
                     No recent orders to display
                  </div>
               </CardContent>
            </Card>

            <Card>
               <CardHeader>
                  <CardTitle>Low Stock Alerts</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="text-sm text-muted-foreground">
                     All products are well stocked
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
