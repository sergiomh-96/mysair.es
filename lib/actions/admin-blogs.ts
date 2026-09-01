"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getBlogs() {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function upsertBlog(formData: FormData) {
  const supabase = await createServerClient()
  const id = formData.get("id") ? Number(formData.get("id")) : undefined

  const sectionsRaw = formData.get("sections")
  let sections = null
  if (sectionsRaw) {
    try { sections = JSON.parse(sectionsRaw as string) } catch {}
  }

  const publishedAtRaw = formData.get("published_at") as string
  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw).toISOString() : new Date().toISOString()

  const payload = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || null,
    content: formData.get("content"),
    sections,
    summary: formData.get("summary") || null,
    image_url: formData.get("image_url") || null,
    author: formData.get("author") || "MYSAir",
    category: formData.get("category") || null,
    tags: formData.get("tags") ? (formData.get("tags") as string).split(",").map(t => t.trim()).filter(Boolean) : [],
    published: formData.get("published") === "true",
    featured: formData.get("featured") === "true",
    reading_time: Number(formData.get("reading_time")) || null,
    route_type: formData.get("route_type") || "blogs",
    published_at: publishedAt,
    // SEO fields
    meta_title: formData.get("meta_title") || null,
    meta_description: formData.get("meta_description") || null,
    meta_keywords: formData.get("meta_keywords") || null,
    og_title: formData.get("og_title") || null,
    og_description: formData.get("og_description") || null,
    og_image: formData.get("og_image") || null,
    canonical_url: formData.get("canonical_url") || null,
    updated_at: new Date().toISOString(),
  }

  if (id) {
    const { error } = await supabase.from("blog_posts").update(payload).eq("id", id)
    if (error) throw error
  } else {
    const { error } = await supabase.from("blog_posts").insert({ ...payload, created_at: new Date().toISOString() })
    if (error) throw error
  }

  revalidatePath("/admin/blogs")
  revalidatePath("/blogs")
  revalidatePath("/blog")
}

function extractSectionsFromItem(item: Record<string, unknown>): Array<{ id: string; level: "h2" | "h3"; title: string; content: string }> | null {
  const sectionsList: Array<{ id: string; level: "h2" | "h3"; title: string; content: string }> = []

  // Check numbered section columns up to 10 sections
  for (let i = 1; i <= 10; i++) {
    const levelRaw = String(
      item[`seccion_${i}_nivel`] || 
      item[`seccion_${i}_tipo`] || 
      item[`Seccion_${i}_Nivel`] || 
      item[`Seccion_${i}_Tipo`] || 
      item[`seccion_${i}_tag`] || 
      item[`h2_${i}_titulo`] ? "h2" : item[`h3_${i}_titulo`] ? "h3" : ""
    ).toLowerCase().trim()

    const title = String(
      item[`seccion_${i}_titulo`] || 
      item[`Seccion_${i}_Titulo`] || 
      item[`seccion_${i}_title`] || 
      item[`h2_${i}_titulo`] || 
      item[`h3_${i}_titulo`] || 
      ""
    ).trim()

    const content = String(
      item[`seccion_${i}_contenido`] || 
      item[`Seccion_${i}_Contenido`] || 
      item[`seccion_${i}_content`] || 
      item[`h2_${i}_contenido`] || 
      item[`h3_${i}_contenido`] || 
      ""
    ).trim()

    if (title || content) {
      const level: "h2" | "h3" = levelRaw.includes("3") || levelRaw === "h3" ? "h3" : "h2"
      sectionsList.push({
        id: `sec-${i}-${Math.random().toString(36).substring(2, 7)}`,
        level,
        title,
        content,
      })
    }
  }

  if (sectionsList.length > 0) {
    return sectionsList
  }

  // Fallback: check json in sections or secciones
  const rawSections = item.sections || item.secciones || item.Secciones
  if (rawSections) {
    if (Array.isArray(rawSections)) {
      return rawSections.map((s, idx) => ({
        id: s.id || `sec-${idx + 1}`,
        level: s.level === "h3" ? "h3" : "h2",
        title: String(s.title || ""),
        content: String(s.content || ""),
      }))
    }
    if (typeof rawSections === "string") {
      try {
        const parsed = JSON.parse(rawSections)
        if (Array.isArray(parsed)) {
          return parsed.map((s, idx) => ({
            id: s.id || `sec-${idx + 1}`,
            level: s.level === "h3" ? "h3" : "h2",
            title: String(s.title || ""),
            content: String(s.content || ""),
          }))
        }
      } catch {}
    }
  }

  return null
}

export async function bulkImportBlogs(blogsList: Record<string, unknown>[]) {
  const supabase = await createServerClient()
  if (!blogsList || blogsList.length === 0) {
    throw new Error("No hay artículos válidos para importar.")
  }

  const sanitized = blogsList.map((item, idx) => {
    const title = String(item.title || item.titulo || item.Titulo || "").trim()
    const slug = String(item.slug || item.Slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `blog-${idx + 1}`).trim()
    const excerpt = item.excerpt || item.extracto || item.Extracto ? String(item.excerpt || item.extracto || item.Extracto) : null
    const summary = item.summary || item.resumen || item.Resumen ? String(item.summary || item.resumen || item.Resumen) : null
    const author = String(item.author || item.autor || item.Autor || "MYSAir").trim()
    const category = item.category || item.categoria || item.Categoria ? String(item.category || item.categoria || item.Categoria) : null
    const tagsRaw = item.tags || item.etiquetas || item.Etiquetas
    const tags = Array.isArray(tagsRaw) ? tagsRaw : typeof tagsRaw === "string" ? tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean) : []
    const published = item.published === true || item.published === "true" || item.publicado === true || item.publicado === "true" || item.Publicado === "SI" || item.Publicado === "Sí"
    const featured = item.featured === true || item.featured === "true" || item.destacado === true || item.destacado === "true" || item.Destacado === "SI" || item.Destacado === "Sí"
    const reading_time = Number(item.reading_time || item.tiempo_lectura) || null
    const route_type = (item.route_type || item.ruta) === "blog" ? "blog" : "blogs"
    const image_url = item.image_url || item.imagen || item.Imagen ? String(item.image_url || item.imagen || item.Imagen) : null
    const meta_title = item.meta_title ? String(item.meta_title) : null
    const meta_description = item.meta_description ? String(item.meta_description) : null
    const meta_keywords = item.meta_keywords ? String(item.meta_keywords) : null
    const canonical_url = item.canonical_url ? String(item.canonical_url) : null

    const sections = extractSectionsFromItem(item)

    let content = String(item.content || item.contenido || item.Contenido || "").trim()
    if (!content && sections && sections.length > 0) {
      // Auto build markdown content if only sections provided
      content = sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n")
    } else if (!content) {
      content = title
    }

    return {
      title,
      slug,
      excerpt,
      content,
      sections,
      summary,
      author,
      category,
      tags,
      published,
      featured,
      reading_time,
      route_type,
      image_url,
      meta_title,
      meta_description,
      meta_keywords,
      canonical_url,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  })

  let successCount = 0
  for (const item of sanitized) {
    if (!item.title || !item.slug) continue

    const { data: existing } = await supabase.from("blog_posts").select("id").eq("slug", item.slug).single()
    if (existing?.id) {
      const { error } = await supabase.from("blog_posts").update(item).eq("id", existing.id)
      if (error) throw error
    } else {
      const { error } = await supabase.from("blog_posts").insert({ ...item, created_at: new Date().toISOString() })
      if (error) throw error
    }
    successCount++
  }

  revalidatePath("/admin/blogs")
  revalidatePath("/blogs")
  revalidatePath("/blog")
  return { count: successCount }
}

export async function deleteBlog(id: number) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/blogs")
  revalidatePath("/blogs")
  revalidatePath("/blog")
}
