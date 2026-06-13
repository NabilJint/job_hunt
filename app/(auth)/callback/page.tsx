"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { InsForgeClient } from "@insforge/sdk";
import { createBrowserClient } from "@insforge/sdk/ssr";
import posthog from "posthog-js";

function createClient() {
  return createBrowserClient({
    refreshUrl: "/api/auth/refresh",
  });
}

function getAccessToken(client: InsForgeClient) {
  const auth = client.auth as unknown as {
    tokenManager: { getAccessToken(): string | null };
    http: { refreshToken: string | null };
  };
  return {
    accessToken: auth.tokenManager.getAccessToken(),
    refreshToken: auth.http.refreshToken,
  };
}

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const client = createClient();

      const { data } = await client.auth.getCurrentUser();

      if (!data?.user) {
        setError("Authentication failed. Please try again.");
        return;
      }

      const { accessToken, refreshToken } = getAccessToken(client);

      if (accessToken) {
        await fetch("/api/auth/set-cookies", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken,
            refreshToken: refreshToken || undefined,
          }),
        });
      }

      posthog.identify(data.user.id, {
        email: data.user.email,
      });
      posthog.capture("login", { userId: data.user.id });

      router.push("/dashboard");
    }

    handleCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-error text-sm mb-4">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="text-accent text-sm font-medium hover:text-accent-dark transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-secondary text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}
