import { NextResponse, type NextRequest } from "next/server";

/**
 * Defense-in-depth only: redirects when the access_token cookie is simply
 * absent. This does NOT verify the JWT signature or role - that happens
 * server-side in `app/admin/layout.tsx` via `GET /auth/me` on every request.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.has("access_token");
  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/((?!login).*)"],
};
