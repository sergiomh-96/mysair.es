import { type NextRequest, NextResponse } from "next/server"

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

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
