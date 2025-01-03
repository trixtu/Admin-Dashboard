import {
  clerkClient,
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const isAuthRoute = createRouteMatcher(["/stores(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const SIDEBAR_COOKIE_NAME = "sidebar";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 zile

export default clerkMiddleware(async (auth, req) => {
  
  const client = await clerkClient();
  const authResult = await client.authenticateRequest(req);

  const { isSignedIn } = authResult || {};

  const { sessionClaims }: any = await auth();

  /* Pages protections */
  if (isAuthRoute(req) && !isSignedIn) {
    auth.protect({
      unauthenticatedUrl: process.env.NEXT_PUBLIC_SERVER_URL + "/sign-in",
    });
  }

  if (isAdminRoute(req) && sessionClaims?.metadata?.role !== "admin") {
    const url = new URL("/unthorized", req.url);
    return NextResponse.redirect(url);
  }

  /* API protections */
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    if (sessionClaims?.metadata?.role !== "admin") {
      return NextResponse.json({
        status: 401,
        message: "you are not authorized as admin",
      });
    }
  }

  if (req.nextUrl.pathname.startsWith("/api/user")) {
    if (!isSignedIn) {
      return NextResponse.json({
        status: 401,
        message: "you are not authenticated (token auth failed)",
      });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|static|.*\\..*).*)", "/api/(.*)"],
};
