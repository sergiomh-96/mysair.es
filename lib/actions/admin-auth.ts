"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"

const SUPABASE_URL = "https://awaqzjughhndfpxjiaff.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3YXF6anVnaGhuZGZweGppYWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0ODkyNTEsImV4cCI6MjA3MzA2NTI1MX0.Y7O1P320s6kz7Nxs1zwUJIWiocMHD52dv3lo7Oam7Uo"

export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos." }
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  let verified = false

  if (serviceRoleKey) {
    // Admin client with service role key (RPC verify_admin_password)
    const adminClient = createSupabaseAdmin(SUPABASE_URL, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data, error } = await adminClient.rpc("verify_admin_password", {
      p_email: email.trim(),
      p_password: password,
    })

    if (!error && data) {
      verified = true
    }
  }

  // Fallback: If no service role key or RPC failed, try standard Supabase Auth
  if (!verified) {
    const key = serviceRoleKey || SUPABASE_ANON_KEY
    const client = createSupabaseAdmin(SUPABASE_URL, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: authData, error: authError } = await client.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (!authError && authData.user) {
      verified = true
    }
  }

  if (!verified) {
    return { error: "Credenciales incorrectas. Verifica tu email y contraseña." }
  }

  // Set a signed session cookie valid for 8 hours
  const cookieStore = await cookies()
  const sessionData = { email: email.trim(), loggedAt: Date.now(), isAdmin: true }
  const sessionValue = Buffer.from(JSON.stringify(sessionData)).toString("base64")

  cookieStore.set("admin_session", sessionValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  })

  redirect("/admin")
}

export async function adminLogout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session")
  redirect("/admin-login")
}

export async function getAdminSession() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get("admin_session")
  if (!sessionCookie) return null

  try {
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, "base64").toString("utf-8"))
    if (Date.now() - sessionData.loggedAt > 8 * 60 * 60 * 1000) return null
    return sessionData
  } catch {
    return null
  }
}
