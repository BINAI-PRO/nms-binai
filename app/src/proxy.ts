import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set(["/", "/sign-in", "/sign-up", "/callback"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get("binai_session")?.value;
  const role = request.cookies.get("binai_role")?.value;

  if (pathname.startsWith("/admin")) {
    if (session === "1" && role === "admin") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (pathname.startsWith("/app")) {
    if (session === "1" && (role === "admin" || role === "resident")) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
