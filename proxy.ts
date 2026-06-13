import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@insforge/sdk/ssr";
import type { CookieStore } from "@insforge/sdk/ssr";

const protectedPaths = ["/dashboard", "/profile", "/find-jobs"];

function toCookieStore(
  cookies: NextRequest["cookies"] | NextResponse["cookies"],
): CookieStore {
  return cookies as unknown as CookieStore;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const response = NextResponse.next({ request });

  const { accessToken } = await updateSession({
    requestCookies: toCookieStore(request.cookies),
    responseCookies: toCookieStore(response.cookies),
  });

  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/find-jobs/:path*"],
};
