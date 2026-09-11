import { MetadataRoute } from 'next'
import { createClient } from "@/lib/supabase/client"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.mysair.es'
  const supabase = createClient()

  // 1. Static Routes
  const staticRoutes = [
    '',
    '/aviso-legal',
    '/blogs',
    '/compatibilidad',
    '/conocenos',
    '/contacto',
    '/documentacion',
    '/politica-cookies',
    '/productos',
    '/productos/difusion-aire',
    '/productos/sistemas-domoticos',
    '/productos/vmc',
    '/software',
    '/software/mys-solver',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }))

  // 2. Fetch Products from Supabase
  const { data: products } = await supabase
    .from("products")
    .select("slug, updated_at")

  const productRoutes = (products || []).map((product: { slug: string; updated_at: string | null }) => ({
    url: `${baseUrl}/productos/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  // 3. Fetch Blogs and Blog Posts from Supabase
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, route_type")
    .eq("published", true)

  const blogRoutes = (posts || []).map((post: { slug: string; updated_at: string | null; route_type?: string | null }) => {
    const isRoot = post.route_type === "root" || post.route_type === "" || post.route_type === "/"
    const path = isRoot ? `/${post.slug}` : `/${post.route_type || 'blogs'}/${post.slug}`
    return {
      url: `${baseUrl}${path}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }
  })

  return [
    ...staticRoutes,
    ...productRoutes,
    ...blogRoutes,
  ]
}
