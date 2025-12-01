"use client";

import { LoginForm } from "@/components/auth/login-form";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
   const searchParams = useSearchParams();
   const router = useRouter();
   const tab = searchParams.get("tab");
   const [activeTab, setActiveTab] = useState(tab === "register" ? "register" : "login");

   useEffect(() => {
      if (tab === "register" || tab === "login") {
         setActiveTab(tab);
      }
   }, [tab]);

   const handleTabChange = (value: string) => {
      setActiveTab(value);
      router.push(`/auth?tab=${value}`, { scroll: false });
   };

   return (
      <div className="relative flex min-h-svh w-full items-center justify-center p-6 md:p-10">
         <div className="absolute left-4 top-4 md:left-8 md:top-8">
            <Button variant="ghost" size="sm" className="gap-2" asChild>
               <Link href="/">
               <ArrowLeft className="h-4 w-4" />
                  Back
               </Link>
            </Button>
         </div>
         <div className="w-full max-w-sm">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
               <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
               </TabsList>
               <TabsContent value="login" className="mt-6">
                  <LoginForm />
               </TabsContent>
               <TabsContent value="register" className="mt-6">
                  <SignUpForm />
               </TabsContent>
            </Tabs>
         </div>
      </div>
   );
}
