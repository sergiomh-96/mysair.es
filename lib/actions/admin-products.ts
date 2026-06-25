"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProducts() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, product_videos(*)")
    .order("sort_order", { ascending: true })
  if (error) throw error
  return data
}

export async function upsertProduct(formData: FormData) {
  const supabase = await createServerClient()
  const id = formData.get("id") ? Number(formData.get("id")) : undefined

  const payload: Record<string, unknown> = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory") || null,
    is_featured: formData.get("is_featured") === "true",
    is_active: formData.get("is_active") === "true",
    sort_order: Number(formData.get("sort_order")) || 0,
    stl_model_url: formData.get("stl_model_url") || null,
  }

  // Parse JSON fields safely
  const jsonFields = [
    "image_url", "dimensions", "fixation_types", "variants", "colors",
    "insulation_types", "lines_vias", "technical_specs", "communication_types",
    "manual_instalador_url", "manual_usuario_url", "bim_url", "cad_url",
    "ficha_tecnica_url",
  ]
  for (const field of jsonFields) {
    const raw = formData.get(field) as string
    if (raw) {
      try { payload[field] = JSON.parse(raw) } catch { payload[field] = raw }
    } else {
      payload[field] = null
    }
  }

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id)
    if (error) throw error
  } else {
    const { error } = await supabase.from("products").insert(payload)
    if (error) throw error
  }

  revalidatePath("/admin/productos")
  revalidatePath("/productos")
}

export async function deleteProduct(id: number) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/productos")
  revalidatePath("/productos")
}

export async function upsertProductVideo(formData: FormData) {
  const supabase = await createServerClient()
  const id = formData.get("id") ? Number(formData.get("id")) : undefined
  const payload = {
    product_id: Number(formData.get("product_id")),
    title: formData.get("title"),
    youtube_url: formData.get("youtube_url"),
    description: formData.get("description") || null,
    sort_order: Number(formData.get("sort_order")) || 0,
  }
  if (id) {
    const { error } = await supabase.from("product_videos").update(payload).eq("id", id)
    if (error) throw error
  } else {
    const { error } = await supabase.from("product_videos").insert(payload)
    if (error) throw error
  }
  revalidatePath("/admin/productos")
}

export async function deleteProductVideo(id: number) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("product_videos").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/productos")
}
