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

export async function deleteBlog(id: number) {
  const supabase = await createServerClient()
  const { error } = await supabase.from("blog_posts").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/admin/blogs")
  revalidatePath("/blogs")
  revalidatePath("/blog")
}
