import { NextResponse } from "next/server";
import { setAuthCookies } from "@insforge/sdk/ssr";
import type { CookieWriter } from "@insforge/sdk/ssr";

function toCookieWriter(cookies: NextResponse["cookies"]): CookieWriter {
  return cookies as unknown as CookieWriter;
}

export async function POST(request: Request) {
  try {
    const { accessToken, refreshToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Missing accessToken" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });
    setAuthCookies(toCookieWriter(response.cookies), {
      accessToken,
      refreshToken,
    });

    return response;
  } catch (error) {
    console.error("[api/auth/set-cookies]", error);
    return NextResponse.json(
      { success: false, error: "Failed to set auth cookies" },
      { status: 500 },
    );
  }
}
