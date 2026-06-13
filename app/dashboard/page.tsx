"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge-client";
import posthog from "posthog-js";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    async function load() {
      const client = insforge();
      const { data } = await client.auth.getCurrentUser();
      if (data?.user) {
        setUser(data.user);
      }
    }
    load();
  }, []);

  async function handleSignOut() {
    posthog.reset();
    const client = insforge();
    await client.auth.signOut();
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6">
        <h1 className="text-lg font-bold text-text-primary">Dashboard</h1>
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-text-secondary">{user.email}</span>
          )}
          <button
            onClick={handleSignOut}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center">
        <p className="text-text-secondary">Dashboard coming soon.</p>
      </main>
    </div>
  );
}
