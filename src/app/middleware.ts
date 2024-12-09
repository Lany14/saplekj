import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Force dynamic rendering for dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-middleware-cache", "no-cache");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}
