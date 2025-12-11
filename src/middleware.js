import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const url = req.nextUrl.clone();

  // Only users with usertype "2" (admin) can access matched routes
  if (!token) {
    console.warn("Access denied: No token found");
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token.usertype !== "2") {
    console.warn("Access denied: Invalid usertype", token.usertype);

    const referer = req.headers.get("referer");
    if (referer) {
      try {
        const refererUrl = new URL(referer);
        if (!refererUrl.pathname.startsWith("/admin")) {
          return NextResponse.redirect(refererUrl);
        }
      } catch (e) {
        console.warn("Failed to parse referer", e);
      }
    }

    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
