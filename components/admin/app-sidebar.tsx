"use client";

import {
   LayoutDashboard,
   Package,
   ShoppingCart,
   Users,
   Settings,
   ChevronRight,
   Store,
   BarChart3,
   Tag,
   Truck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
   SidebarFooter,
} from "@/components/ui/sidebar";
import {
   Collapsible,
   CollapsibleContent,
   CollapsibleTrigger,
} from "@/components/ui/collapsible";

const mainNavItems = [
   {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
   },
   {
      title: "Products",
      icon: Package,
      href: "/admin/products",
      items: [
         { title: "All Products", href: "/admin/products" },
         { title: "Add New", href: "/admin/products/new" },
         { title: "Categories", href: "/admin/products/categories" },
         { title: "Inventory", href: "/admin/products/inventory" },
      ],
   },
   {
      title: "Orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      items: [
         { title: "All Orders", href: "/admin/orders" },
         { title: "Pending", href: "/admin/orders?status=pending" },
         { title: "Processing", href: "/admin/orders?status=processing" },
         { title: "Completed", href: "/admin/orders?status=completed" },
      ],
   },
   {
      title: "Customers",
      icon: Users,
      href: "/admin/customers",
   },
   {
      title: "Analytics",
      icon: BarChart3,
      href: "/admin/analytics",
   },
];

const settingsNavItems = [
   {
      title: "Store Settings",
      icon: Store,
      href: "/admin/settings/store",
   },
   {
      title: "Shipping",
      icon: Truck,
      href: "/admin/settings/shipping",
   },
   {
      title: "Discounts",
      icon: Tag,
      href: "/admin/settings/discounts",
   },
   {
      title: "Settings",
      icon: Settings,
      href: "/admin/settings",
   },
];

export function AppSidebar() {
   const pathname = usePathname();

   return (
      <Sidebar variant="sidebar" collapsible="icon" className="border-r bg-sidebar w-64">
         <SidebarHeader className="border-b">
            <Link href="/admin" className="flex items-center gap-2 px-4 py-4 group-data-[collapsible=icon]:!p-2">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Store className="h-5 w-5" />
               </div>
               <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold">Hexa Shop</span>
                  <span className="text-xs text-muted-foreground">Admin Panel</span>
               </div>
            </Link>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {mainNavItems.map((item) =>
                        item.items ? (
                           <Collapsible
                              key={item.title}
                              defaultOpen={pathname.startsWith(item.href)}
                              asChild
                           >
                              <SidebarMenuItem>
                                 <CollapsibleTrigger asChild>
                                    <SidebarMenuButton>
                                       <item.icon className="h-4 w-4" />
                                       <span>{item.title}</span>
                                       <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                                    </SidebarMenuButton>
                                 </CollapsibleTrigger>
                                 <CollapsibleContent>
                                    <SidebarMenuSub>
                                       {item.items.map((subItem) => (
                                          <SidebarMenuSubItem key={subItem.title}>
                                             <SidebarMenuSubButton
                                                asChild
                                                isActive={pathname === subItem.href}
                                             >
                                                <Link href={subItem.href}>
                                                   {subItem.title}
                                                </Link>
                                             </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                       ))}
                                    </SidebarMenuSub>
                                 </CollapsibleContent>
                              </SidebarMenuItem>
                           </Collapsible>
                        ) : (
                           <SidebarMenuItem key={item.title}>
                              <SidebarMenuButton
                                 asChild
                                 isActive={pathname === item.href}
                              >
                                 <Link href={item.href}>
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                 </Link>
                              </SidebarMenuButton>
                           </SidebarMenuItem>
                        )
                     )}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
               <SidebarGroupLabel>Settings</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {settingsNavItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                           <SidebarMenuButton
                              asChild
                              isActive={pathname === item.href}
                           >
                              <Link href={item.href}>
                                 <item.icon className="h-4 w-4" />
                                 <span>{item.title}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                     <Link href="/">
                        <Store className="h-4 w-4" />
                        <span>Back to Store</span>
                     </Link>
                  </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   );
}
