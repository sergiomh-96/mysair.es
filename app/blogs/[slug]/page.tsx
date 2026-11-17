import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { BlogPostDetail } from "@/components/blog/blog-post-detail"
import { JsonLd } from "@/components/seo/json-ld"
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFaqSchema,
  extractFaqsFromSections,
} from "@/lib/seo/structured-data"

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

  const pageUrl = `/blogs/${slug}`
  const postFaqs = extractFaqsFromSections(post.sections)
  const schemas: Array<Record<string, unknown>> = [
    buildArticleSchema(post, pageUrl),
    buildBreadcrumbSchema([
      { name: "Inicio", url: "/" },
      { name: "Blog", url: "/blogs" },
      { name: post.title, url: pageUrl },
    ]),
    ...(postFaqs.length > 0 ? [buildFaqSchema(postFaqs)] : []),
  ]

  return (
    <main className="min-h-screen">
      <JsonLd data={schemas} />
      <Navigation />
      <BlogPostDetail post={post} />
      <Footer />
    </main>
  )
}
