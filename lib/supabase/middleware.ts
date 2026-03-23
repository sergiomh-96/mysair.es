import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

const SUPABASE_URL = "https://awaqzjughhndfpxjiaff.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODkyNTEsImV4cCI6MjA3MzA2NTI1MX0.Y7O1P320s6kz7Nxs1zwUJIWiocMHD52dv3lo7Oam7Uo"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createSupabaseServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin-login"
  const isLoginPage = pathname === "/admin-login"

  if (isAdminRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin-login"
    return NextResponse.redirect(url)
  }

  if (isLoginPage && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
