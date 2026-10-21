import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "ta"];
const defaultLocale = "en";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Avoid redirecting for internal Next.js paths, API routes, and public assets
  const isInternal = pathname.startsWith("/_next") || 
                     pathname.startsWith("/api") || 
                     pathname.includes(".") || 
                     pathname === "/favicon.ico";

  if (pathnameIsMissingLocale && !isInternal) {
    // Redirect to default locale
    return NextResponse.redirect(
      new URL(`/${defaultLocale}${pathname === "/" ? "" : pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static files
    "/((?!_next|api|assets|favicon.ico|.*\\..*).*)",
  ],
};
