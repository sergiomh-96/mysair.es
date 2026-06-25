import { notFound } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/products/product-detail"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

const PRODUCT_SEO: Record<string, { title: string; h1: string }> = {
  ma35: {
    title: "Difusor Lineal Oculto MA35 - Rejilla Lineal de Alta Integración | MYSAir",
    h1: "Difusor Lineal Oculto MA35",
  },
  mr01: {
    title: "Rejilla Motorizada de Impulsión MR01 (Sistema Compatible) | MYSAir",
    h1: "Rejilla Motorizada de Impulsión MR01",
  },
  termostato_roma: {
    title: "Termostato Digital Táctil Serie Roma | MYSAir",
    h1: "Termostato Digital Táctil Roma",
  },
  ms201v: {
    title: "Módulo de Control de 7 Zonas MS201V para Zonificación | MYSAir",
    h1: "Módulo de Control de 7 Zonas MS201V",
  },
  ma48: {
    title: "Plenum para Difusor Lineal MA48 - Accesorios de Difusión | MYSAir",
    h1: "Plenum para Difusor Lineal MA48",
  },
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params

  if (PRODUCT_SEO[slug]) {
    return {
      title: PRODUCT_SEO[slug].title,
      description: "Ficha de producto y documentación técnica de MYSAir.",
    }
  }

  try {
    const supabase = await createServerSupabaseClient()
    const { data: product } = await supabase
      .from("products")
      .select("name, description")
      .eq("slug", slug)
      .single()

    if (product) {
      return {
        title: `${product.name} | MYSAir`,
        description: product.description || "Ficha técnica y detalles del producto.",
      }
    }
  } catch (error) {
    console.error("Error generating metadata:", error)
  }

  return {
    title: "Producto | MYSAir",
    description: "Ficha de producto y detalles de climatización.",
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !product) {
    notFound()
  }

  const { data: videos } = await supabase
    .from("product_videos")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true })

  // Override the product.name field with the hardcoded h1 value if it matches.
  const seoConfig = PRODUCT_SEO[slug]
  const displayProduct = seoConfig ? { ...product, name: seoConfig.h1 } : product

  return (
    <main className="min-h-screen">
      <Navigation />
      <ProductDetail product={displayProduct} videos={videos || []} />
      <Footer />
    </main>
  )
}
