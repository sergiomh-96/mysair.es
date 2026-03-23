import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogPostDetail } from "@/components/blog/blog-post-detail"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("route_type", "blogs")
    .eq("published", true)
    .single()

  if (error || !post) {
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
