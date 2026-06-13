import { NextResponse } from "next/server";
import { clearAuthCookies } from "@insforge/sdk/ssr";
import type { CookieWriter } from "@insforge/sdk/ssr";

function toCookieWriter(cookies: NextResponse["cookies"]): CookieWriter {
  return cookies as unknown as CookieWriter;
}

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearAuthCookies(toCookieWriter(response.cookies));
  return response;
}
