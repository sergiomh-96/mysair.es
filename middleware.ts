import { type NextRequest, NextResponse } from "next/server"

// ── Security Headers ────────────────────────────────────────────────────────
const CSP_DIRECTIVES = [
  "default-src 'self'",
  // Scripts: propios + inline (GTM/GA require 'unsafe-inline') + dominios de terceros autorizados
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms https://scripts.clarity.ms https://vercel.live https://va.vercel-scripts.com",
  // Estilos: propios + inline (Tailwind/Radix) + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Imágenes: propios + data URIs + blobs + dominios de analytics, Supabase, banderas e idioma
  "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://*.google.com https://*.supabase.co https://lh3.googleusercontent.com https://flagcdn.com https://pagead2.googlesyndication.com",
  // Fuentes: propias + Google Fonts
  "font-src 'self' https://fonts.gstatic.com",
  // Conexiones: propias + analytics + Google Ads + Supabase
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com https://*.clarity.ms https://*.supabase.co https://va.vercel-scripts.com https://vercel.live https://pagead2.googlesyndication.com",
  // Iframes: solo GTM noscript
  "frame-src 'self' https://www.googletagmanager.com",
  // Protección contra clickjacking (reemplaza X-Frame-Options)
  "frame-ancestors 'self'",
  // Restricciones adicionales
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ")

const SECURITY_HEADERS: Record<string, string> = {
  // CSP — Política de Seguridad de Contenido
  "Content-Security-Policy": CSP_DIRECTIVES,
  // HSTS — Fuerza HTTPS en todos los subdominios y solicita inclusión en listas de precarga
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  // Referrer — Envía solo el origen en peticiones cross-origin
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Previene MIME sniffing
  "X-Content-Type-Options": "nosniff",
  // OWASP recomienda 0 (la CSP ya cubre la protección contra XSS)
  "X-XSS-Protection": "0",
  // Permissions — Desactiva APIs de dispositivo y FLoC
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()",
}
// ────────────────────────────────────────────────────────────────────────────

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin-login"
  const isLoginPage = pathname === "/admin-login"

  // Skip for Next.js internals, static assets and file extensions
  const isInternal =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/cloud") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)

  if (!isInternal && !isAdminRoute && !isLoginPage) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://awaqzjughhndfpxjiaff.supabase.co"
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODkyNTEsImV4cCI6MjA3MzA2NTI1MX0.Y7O1P320s6kz7Nxs1zwUJIWiocMHD52dv3lo7Oam7Uo"

      if (supabaseUrl && supabaseKey) {
        const url = `${supabaseUrl}/rest/v1/url_redirects?select=destination_url,redirect_type&source_path=eq.${encodeURIComponent(pathname)}&is_active=eq.true&limit=1`
        const res = await fetch(url, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Accept: "application/json",
          },
        })

        if (res.ok) {
          const rows = await res.json()
          if (rows.length > 0) {
            const { destination_url, redirect_type } = rows[0]
            // Fire-and-forget hit counter
            fetch(
              `${supabaseUrl}/rest/v1/rpc/increment_redirect_hits`,
              {
                method: "POST",
                headers: {
                  apikey: supabaseKey,
                  Authorization: `Bearer ${supabaseKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ path: pathname }),
              }
            )
            return NextResponse.redirect(destination_url, {
              status: redirect_type || 301,
            })
          }
        }
      }
    } catch {
      // If DB lookup fails, continue normally
    }
  }
  // ──────────────────────────────────────────────────────────────────────────

  const adminSession = request.cookies.get("admin_session")

  let isAuthenticated = false
  if (adminSession) {
    try {
      const sessionData = JSON.parse(
        Buffer.from(adminSession.value, "base64").toString("utf-8")
      )
      isAuthenticated =
        sessionData.isAdmin === true &&
        Date.now() - sessionData.loggedAt < 8 * 60 * 60 * 1000
    } catch {
      isAuthenticated = false
    }
  }

  if (isAdminRoute && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin-login"
    return NextResponse.redirect(url)
  }

  if (isLoginPage && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  // Aplicar cabeceras de seguridad a todas las respuestas
  const response = NextResponse.next()
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
