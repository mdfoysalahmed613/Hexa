"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "../ui/button";
import Link from "next/link";
import {
   LogOut,
   Settings,
   User as UserIcon,
   Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { isAdmin } from "@/lib/auth/roles";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { EditProfileDialog } from "./edit-profile-dialog";

export default function AuthButton() {
   const [user, setUser] = useState<User | null>(null);
   const [isDialogOpen, setIsDialogOpen] = useState(false);
   const supabase = createClient();
   const router = useRouter();

   const fetchUser = async () => {
      const {
         data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
   };

   useEffect(() => {
      fetchUser();

      const {
         data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
         setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
   }, []);

   const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push("/auth?tab=login");
   };
   const getUserInitials = (user: User) => {
      const name = user.user_metadata?.full_name || user.email || "";
      return name
         .split(" ")
         .map((n: string) => n[0])
         .join("")
         .toUpperCase()
         .slice(0, 2);
   };

   if (!user) {
      return (
         <Button variant="ghost" size="icon" asChild>
            <Link href="/auth">
               <UserIcon className="h-5 w-5" />
               <span className="sr-only">Login</span>
            </Link>
         </Button>
      );
   }
   console.log("Authenticated user:", user);
   return (
      <>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                     <AvatarImage
                        src={user.user_metadata?.avatar_url}
                        alt={user.user_metadata?.full_name || user.email || "User"}
                     />
                     <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User menu</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
               <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                     <p className="text-sm font-medium leading-none">
                        {user.user_metadata?.full_name || "User"}
                     </p>
                     <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                     </p>
                     {isAdmin(user) && (
                        <p className="text-xs text-primary font-medium">Admin</p>
                     )}
                  </div>
               </DropdownMenuLabel>
               <DropdownMenuSeparator />
               {isAdmin(user) && (
                  <>
                     <DropdownMenuItem asChild>
                        <Link href="/admin">
                           <Shield className="mr-2 h-4 w-4" />
                           <span>Admin Dashboard</span>
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                  </>
               )}
               <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
               </DropdownMenuItem>
               <DropdownMenuSeparator />
               <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>

         <EditProfileDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            user={user}
            onUpdate={fetchUser}
         />
      </>
   );
}


