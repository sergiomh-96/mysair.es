import { createServerSupabaseClient } from "@/lib/supabase/server"
import { BlogCard } from "./blog-card"

interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  author: string
  image_url: string
  category: string
  tags: string[]
  route_type?: string
  created_at: string
}

export async function BlogGrid() {
  const supabase = await createServerSupabaseClient()

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .or("route_type.neq.root,route_type.is.null")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Error al cargar los artículos</p>
      </div>
    )
  }

  // Filtrar los posts cuya ruta sea raíz ("root", "/" o vacía), actuando como landing pages independientes
  const visiblePosts = (posts || []).filter((post: BlogPost) => {
    const rt = post.route_type?.trim().toLowerCase()
    return rt !== "root" && rt !== "/" && rt !== ""
  })

  if (visiblePosts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se encontraron artículos</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {visiblePosts.map((post: BlogPost) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
