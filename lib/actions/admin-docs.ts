"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getDocLinks() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("external_links")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function addDocLink(formData: FormData) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("external_links").insert({
    name: formData.get("name"),
    url: formData.get("url"),
    description: formData.get("description") || null,
    type: formData.get("type") || "documentation",
    is_active: true,
  })
  if (error) throw error
  revalidatePath("/admin/documentacion")
}

export async function deleteDocLink(id: number) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("external_links").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/documentacion")
}

export async function toggleDocLink(id: number, is_active: boolean) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("external_links").update({ is_active }).eq("id", id)
  if (error) throw error
  revalidatePath("/admin/documentacion")
}
