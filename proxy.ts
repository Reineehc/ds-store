import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/admin/login";

  const token = req.cookies.get("admin-auth")?.value;
  const admin = token ? await verifyAdminToken(token) : null;

  if (isAdminPage && !isLoginPage && !admin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isLoginPage && admin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};