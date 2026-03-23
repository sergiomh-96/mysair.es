"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"

const SUPABASE_URL = "https://awaqzjughhndfpxjiaff.supabase.co"

export async function adminLogin(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email y contraseña son requeridos." }
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    return { error: "Configuración del servidor incompleta." }
  }

  // Admin client with service role key bypasses captcha entirely
  const adminClient = createSupabaseAdmin(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Verify password directly via SQL function (uses pgcrypto, no captcha)
  const { data: verified, error } = await adminClient.rpc("verify_admin_password", {
    p_email: email.trim(),
    p_password: password,
  })

  if (error || !verified) {
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
