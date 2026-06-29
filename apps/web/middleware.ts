import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0].toLowerCase();

  if (hostname === "www.babieshippo.com") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.hostname = "babieshippo.com";
    redirectUrl.protocol = "https:";
    redirectUrl.port = "";
    return NextResponse.redirect(redirectUrl, 308);
  }

  if (hostname === "app.babieshippo.com" && request.nextUrl.pathname === "/") {
    const founderUrl = request.nextUrl.clone();
    founderUrl.pathname = "/founder";
    return NextResponse.rewrite(founderUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
