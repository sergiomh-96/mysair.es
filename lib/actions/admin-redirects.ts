"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getRedirects() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("url_redirects")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function upsertRedirect(formData: FormData) {
  const supabase = await createServerClient()

  const rawSourcePath = (formData.get("source_path") as string).trim()

  // Normalize: strip domain if user entered a full URL
  let sourcePath = rawSourcePath
  try {
    const parsed = new URL(rawSourcePath)
    sourcePath = parsed.pathname + parsed.search
  } catch {
    // It's already a relative path — ensure it starts with /
    if (!sourcePath.startsWith("/")) sourcePath = "/" + sourcePath
  }

  const payload = {
    source_path: sourcePath,
    destination_url: (formData.get("destination_url") as string).trim(),
    redirect_type: Number(formData.get("redirect_type")) || 301,
    description: formData.get("description") || null,
    is_active: formData.get("is_active") === "true",
    updated_at: new Date().toISOString(),
  }

  const id = formData.get("id")

  if (id) {
    const { error } = await supabase
      .from("url_redirects")
      .update(payload)
      .eq("id", Number(id))
    if (error) throw error
  } else {
    const { error } = await supabase
      .from("url_redirects")
      .insert({ ...payload, hit_count: 0 })
    if (error) throw error
  }

  revalidatePath("/admin/redirects")
}

export async function deleteRedirect(id: number) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("url_redirects").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/redirects")
}

export async function toggleRedirect(id: number, isActive: boolean) {
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("url_redirects")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id)
  if (error) throw error
  revalidatePath("/admin/redirects")
}
