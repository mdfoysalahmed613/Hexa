import { AuthButton } from "@/components/auth/auth-button";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-10 text-primary">Welcome to the Home Page</h1>
      <p className="mt-4 text-lg">This is the main landing page of the application.</p>
      <Suspense fallback={<Spinner className="mt-10" />}>
        <AuthButton />
      </Suspense>
    </main>
  );
}
