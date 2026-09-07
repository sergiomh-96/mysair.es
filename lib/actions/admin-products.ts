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

  const name = formData.get("name") ? String(formData.get("name")).trim() : ""
  const slug = formData.get("slug") ? String(formData.get("slug")).trim() : ""
  const category = formData.get("category") ? String(formData.get("category")).trim() : ""

  if (!name) {
    throw new Error("El nombre del producto es obligatorio.")
  }
  if (!slug) {
    throw new Error("El slug del producto es obligatorio.")
  }
  if (!category) {
    throw new Error("La categoría del producto es obligatoria.")
  }

  const payload: Record<string, unknown> = {
    name,
    slug,
    description: formData.get("description") ? String(formData.get("description")).trim() : null,
    category,
    subcategory: formData.get("subcategory") ? String(formData.get("subcategory")).trim() : null,
    is_featured: formData.get("is_featured") === "true",
    is_active: formData.get("is_active") !== "false",
    sort_order: Number(formData.get("sort_order")) || 0,
    stl_model_url: formData.get("stl_model_url") ? String(formData.get("stl_model_url")).trim() : null,
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

  let savedData = null
  if (id) {
    const { data, error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id)
      .select("*, product_videos(*)")
      .single()
    if (error) throw error
    savedData = data
  } else {
    const { data, error } = await supabase
      .from("products")
      .insert(payload)
      .select("*, product_videos(*)")
      .single()
    if (error) throw error
    savedData = data
  }

  revalidatePath("/admin/productos")
  revalidatePath("/productos")
  return savedData
}

export async function bulkImportProducts(productsList: Record<string, unknown>[]) {
  const supabase = await createServerClient()
  if (!productsList || productsList.length === 0) {
    throw new Error("No hay productos válidos para importar.")
  }

  const sanitized = productsList.map((item, idx) => {
    const name = String(item.name || item.nombre || item.Nombre || "").trim()
    const slug = String(item.slug || item.Slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `prod-${idx + 1}`).trim()
    const category = String(item.category || item.categoria || item.Categoria || "air_diffusion").trim()
    const subcategory = item.subcategory || item.subcategoria || item.Subcategoria ? String(item.subcategory || item.subcategoria || item.Subcategoria).trim() : null
    const description = item.description || item.descripcion || item.Descripcion ? String(item.description || item.descripcion || item.Descripcion) : null
    const is_featured = item.is_featured === true || item.is_featured === "true" || item.destacado === true || item.destacado === "true" || item.Destacado === "SI" || item.Destacado === "Sí"
    const is_active = item.is_active !== false && item.is_active !== "false" && item.activo !== false && item.activo !== "false" && item.Activo !== "NO"
    const sort_order = Number(item.sort_order || item.orden || item.Orden) || 0
    const stl_model_url = item.stl_model_url ? String(item.stl_model_url).trim() : null

    // Parse JSON / list fields safely
    const parseField = (val: unknown) => {
      if (!val) return null
      if (typeof val === "object") return val
      if (typeof val === "string") {
        const trimmed = val.trim()
        if (!trimmed) return null
        try {
          return JSON.parse(trimmed)
        } catch {
          if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
            return [{ name: "Documento", url: trimmed }]
          }
          return trimmed
        }
      }
      return val
    }

    return {
      name,
      slug,
      category,
      subcategory,
      description,
      is_featured,
      is_active,
      sort_order,
      stl_model_url,
      image_url: parseField(item.image_url || item.imagenes || item.Imagenes),
      dimensions: parseField(item.dimensions || item.dimensiones || item.Dimensiones),
      variants: parseField(item.variants || item.variantes || item.Variantes),
      colors: parseField(item.colors || item.colores || item.Colores),
      fixation_types: parseField(item.fixation_types || item.fijaciones || item.Fijaciones),
      insulation_types: parseField(item.insulation_types || item.aislamientos || item.Aislamientos),
      lines_vias: parseField(item.lines_vias || item.vias || item.Vias),
      communication_types: parseField(item.communication_types || item.comunicaciones || item.Comunicaciones),
      technical_specs: parseField(item.technical_specs || item.especificaciones || item.Especificaciones),
      ficha_tecnica_url: parseField(item.ficha_tecnica_url || item.ficha_tecnica || item.Ficha_Tecnica),
      manual_instalador_url: parseField(item.manual_instalador_url || item.manual_instalador || item.Manual_Instalador),
      manual_usuario_url: parseField(item.manual_usuario_url || item.manual_usuario || item.Manual_Usuario),
      bim_url: parseField(item.bim_url || item.bim || item.BIM),
      cad_url: parseField(item.cad_url || item.cad || item.CAD),
    }
  })

  // Upsert or insert one by one to give specific feedback and handle conflicts
  let successCount = 0
  for (const item of sanitized) {
    if (!item.name || !item.slug) continue
    
    // Check if slug exists
    const { data: existing } = await supabase.from("products").select("id").eq("slug", item.slug).single()
    if (existing?.id) {
      const { error } = await supabase.from("products").update(item).eq("id", existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from("products").insert(item)
      if (error) throw error
    }
    successCount++
  }

  revalidatePath("/admin/productos")
  revalidatePath("/productos")
  return { count: successCount }
}

export async function duplicateProduct(id: number) {
  const supabase = await createServerClient()
  const { data: original, error: fetchErr } = await supabase
    .from("products")
    .select("*, product_videos(*)")
    .eq("id", id)
    .single()

  if (fetchErr || !original) {
    throw new Error("No se pudo encontrar el producto a duplicar.")
  }

  // Generate unique slug
  const baseSlug = `${original.slug || "producto"}-copia`
  let candidateSlug = baseSlug
  let counter = 1
  while (true) {
    const { data: exists } = await supabase.from("products").select("id").eq("slug", candidateSlug).single()
    if (!exists) break
    counter++
    candidateSlug = `${baseSlug}-${counter}`
  }

  const { id: _origId, created_at: _c, updated_at: _u, product_videos, ...rest } = original

  const cloneJson = (val: unknown) => {
    if (val === null || val === undefined) return null
    if (typeof val === "object") {
      try {
        return JSON.parse(JSON.stringify(val))
      } catch {
        return val
      }
    }
    return val
  }

  const newProductPayload = {
    ...rest,
    name: `${original.name} (Copia)`,
    slug: candidateSlug,
    sort_order: (original.sort_order ?? 0) + 1,
    // Explicit specifications cloning
    technical_specs: cloneJson(original.technical_specs),
    variants: cloneJson(original.variants),
    dimensions: cloneJson(original.dimensions),
    colors: cloneJson(original.colors),
    fixation_types: cloneJson(original.fixation_types),
    insulation_types: cloneJson(original.insulation_types),
    lines_vias: cloneJson(original.lines_vias),
    communication_types: cloneJson(original.communication_types),
    // Explicit files and documentation cloning
    image_url: cloneJson(original.image_url),
    ficha_tecnica_url: cloneJson(original.ficha_tecnica_url),
    manual_instalador_url: cloneJson(original.manual_instalador_url),
    manual_usuario_url: cloneJson(original.manual_usuario_url),
    bim_url: cloneJson(original.bim_url),
    cad_url: cloneJson(original.cad_url),
    stl_model_url: original.stl_model_url ?? null,
  }

  const { data: inserted, error: insertErr } = await supabase
    .from("products")
    .insert(newProductPayload)
    .select("id")
    .single()

  if (insertErr || !inserted) {
    throw insertErr || new Error("Error al duplicar el producto")
  }

  // Clone videos if any
  if (product_videos && Array.isArray(product_videos) && product_videos.length > 0) {
    const videoPayloads = product_videos.map((v: Record<string, unknown>) => ({
      product_id: inserted.id,
      title: v.title,
      youtube_url: v.youtube_url,
      description: v.description,
      sort_order: v.sort_order,
    }))
    await supabase.from("product_videos").insert(videoPayloads)
  }

  revalidatePath("/admin/productos")
  revalidatePath("/productos")
  return { id: inserted.id, name: newProductPayload.name }
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
