import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { AUTH_TOKEN_KEY } from "./lib/api/auth"

export function middleware(request: NextRequest) {
  // Verificar si existe el token en las cookies
  const token = request.cookies.get(AUTH_TOKEN_KEY)
  const isAuthenticated = !!token

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/notifications")

  // Si no hay token y está intentando acceder a una ruta protegida
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Si hay token y está intentando acceder a rutas de autenticación
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file).
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
