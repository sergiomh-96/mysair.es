import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/products/product-detail"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: product, error } = await supabase.from("products").select("*").eq("slug", slug).single()

  if (error || !product) {
    notFound()
  }

  const { data: videos } = await supabase
    .from("product_videos")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true })

  return (
    <main className="min-h-screen">
      <Navigation />
      <ProductDetail product={product} videos={videos || []} />
      <Footer />
    </main>
  )
}
