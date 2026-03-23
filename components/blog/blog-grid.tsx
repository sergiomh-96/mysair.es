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
  created_at: string
}

export async function BlogGrid() {
  const supabase = await createServerSupabaseClient()

  const { data: posts, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching blog posts:", error)
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Error al cargar los artículos</p>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se encontraron artículos</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {posts.map((post: BlogPost) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  )
}
