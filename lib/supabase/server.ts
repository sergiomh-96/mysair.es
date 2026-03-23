import { createServerClient as createSupabaseServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const SUPABASE_URL = "https://awaqzjughhndfpxjiaff.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODkyNTEsImV4cCI6MjA3MzA2NTI1MX0.Y7O1P320s6kz7Nxs1zwUJIWiocMHD52dv3lo7Oam7Uo"

// Auth client - uses ANON key, respects RLS and user sessions
export async function createAuthServerClient() {
  const cookieStore = await cookies()
  return createSupabaseServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() { return cookieStore.getAll() },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {}
      },
    },
  })
}

// Service client - uses SERVICE ROLE key, bypasses RLS for admin DB operations
export async function createServerClient() {
  const cookieStore = await cookies()
  return createSupabaseServerClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    }
  )
}

export const createServerSupabaseClient = createServerClient
