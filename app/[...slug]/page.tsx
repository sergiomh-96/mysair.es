import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogPostDetail } from "@/components/blog/blog-post-detail"
import type { Metadata } from "next"

interface DynamicCustomRouteProps {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: DynamicCustomRouteProps): Promise<Metadata> {
  const { slug } = await params
  if (!slug || slug.length === 0) return {}

  const supabase = await createServerSupabaseClient()
  let post = null

  if (slug.length === 1) {
    // Directly under root domain: /mi-articulo
    const articleSlug = slug[0]
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, meta_title, meta_description, og_title, og_description, og_image")
      .eq("slug", articleSlug)
      .or("route_type.eq.root,route_type.eq.,route_type.is.null")
      .eq("published", true)
      .maybeSingle()
    post = data
  } else if (slug.length === 2) {
    // Custom route prefix: /guias/mi-articulo
    const [routeType, articleSlug] = slug
    const { data } = await supabase
      .from("blog_posts")
      .select("title, excerpt, meta_title, meta_description, og_title, og_description, og_image")
      .eq("slug", articleSlug)
      .eq("route_type", routeType)
      .eq("published", true)
      .maybeSingle()
    post = data
  }

  if (!post) return {}

  return {
    title: post.meta_title || `${post.title} | MYSAir`,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.og_title || post.meta_title || post.title,
      description: post.og_description || post.meta_description || post.excerpt || undefined,
      images: post.og_image ? [{ url: post.og_image }] : undefined,
    },
  }
}

export default async function DynamicCustomRoutePage({ params }: DynamicCustomRouteProps) {
  const { slug } = await params

  if (!slug || slug.length === 0) {
    notFound()
  }

  // Prevent matching static files (e.g. .ico, .png, .txt, etc.)
  if (slug.some((s) => /\.[a-zA-Z0-9]+$/.test(s))) {
    notFound()
  }

  // Prevent collisions with reserved prefixes
  const reserved = ["admin", "api", "cloud", "_next"]
  if (reserved.includes(slug[0].toLowerCase())) {
    notFound()
  }

  const supabase = await createServerSupabaseClient()
  let post = null

  if (slug.length === 1) {
    // 1. Directly under root domain: /mi-articulo
    const articleSlug = slug[0]
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", articleSlug)
      .or("route_type.eq.root,route_type.eq.,route_type.is.null")
      .eq("published", true)
      .maybeSingle()

    if (!error && data) {
      post = data
    }
  } else if (slug.length === 2) {
    // 2. Custom route prefix: /guias/mi-articulo
    const [routeType, articleSlug] = slug
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", articleSlug)
      .eq("route_type", routeType)
      .eq("published", true)
      .maybeSingle()

    if (!error && data) {
      post = data
    }
  }

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <Navigation />
      <BlogPostDetail post={post} />
      <Footer />
    </main>
  )
}
