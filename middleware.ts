import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  COOKIE_NAME,
  verifySessionToken,
} from "@/lib/auth/session-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (await verifySessionToken(token)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/admin/api")) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!(await verifySessionToken(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
