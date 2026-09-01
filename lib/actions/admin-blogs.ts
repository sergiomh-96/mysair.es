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

export async function bulkImportBlogs(blogsList: Record<string, unknown>[]) {
  const supabase = await createServerClient()
  if (!blogsList || blogsList.length === 0) {
    throw new Error("No hay artículos válidos para importar.")
  }

  const sanitized = blogsList.map((item, idx) => {
    const title = String(item.title || item.titulo || item.Titulo || "").trim()
    const slug = String(item.slug || item.Slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `blog-${idx + 1}`).trim()
    const excerpt = item.excerpt || item.extracto || item.Extracto ? String(item.excerpt || item.extracto || item.Extracto) : null
    const content = String(item.content || item.contenido || item.Contenido || title).trim()
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

    let sections = null
    const sectionsRaw = item.sections || item.secciones
    if (sectionsRaw) {
      if (typeof sectionsRaw === "object") sections = sectionsRaw
      else if (typeof sectionsRaw === "string") {
        try { sections = JSON.parse(sectionsRaw) } catch {}
      }
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
