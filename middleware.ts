// app/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";


export default async function middleware(req: NextRequest) {

  const path = req.nextUrl.pathname;

  // allow path
  if (
    path === "/" ||
    path.includes("_next") ||
    path.startsWith("/api/auth")||
    path.startsWith("/api/external")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET!;
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);    
    const res = NextResponse.next();
    
    res.headers.set("x-user-id", payload.id as string);
    res.headers.set("x-user-role", payload.role as string);
    res.headers.set("x-user-company", payload.companyId as string);
    return res;
  } catch (err) {
    console.error("[MIDDLEWARE_JWT_ERROR]", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: "/:path*",
};
