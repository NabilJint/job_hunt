"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { insforge } from "@/lib/insforge-client";
import posthog from "posthog-js";

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      try {
        const client = insforge();
        const { data } = await client.auth.getCurrentUser();
        setUser(data?.user ?? null);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, []);

  async function handleSignOut() {
    posthog.reset();
    const client = insforge();
    await client.auth.signOut();
    await fetch("/api/auth/sign-out", { method: "POST" });
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="h-16 w-full bg-surface px-6 flex items-center justify-between border-b border-border">
      <Link href="/">
        <Image 
          src="/logo.png" 
          alt="JobPilot Logo" 
          width={120} 
          height={120} 
          className="rounded-[10px]"
        />
      </Link>

      <div className="flex items-center gap-8">
        <div className="hidden md:flex items-center gap-8">
          {user && (
            <>
              <Link 
                href="/dashboard" 
                className="text-text-dark font-medium text-[14px] leading-[20px] hover:text-accent transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                href="/find-jobs" 
                className="text-text-dark font-medium text-[14px] leading-[20px] hover:text-accent transition-colors"
              >
                Find Jobs
              </Link>
              <Link 
                href="/profile" 
                className="text-text-dark font-medium text-[14px] leading-[20px] hover:text-accent transition-colors"
              >
                Profile
              </Link>
            </>
          )}
        </div>
        {loading ? null : user ? (
          <button
            onClick={handleSignOut}
            className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
          >
            Sign out
          </button>
        ) : (
          <Link href="/login">
            <Button className="bg-accent text-accent-foreground rounded-md px-4 py-2 text-[14px] font-medium">
              Start for free
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
