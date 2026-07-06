import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductsHeader } from "@/components/products/products-header"
import { ProductsClient } from "@/components/products/products-client"
import { SeoTextBlock } from "@/components/products/seo-text-block"
import type { Metadata } from "next"

const CATEGORY_SEO: Record<
  string,
  { title: string; h1: string; description: string }
> = {
  air_diffusion: {
    title: "Rejillas de Aire Acondicionado y Sistemas de Difusión | MYSAir",
    h1: "Rejillas de Aire Acondicionado y Sistemas de Difusión",
    description:
      "Fabricantes de rejillas de aire acondicionado, rejillas de impulsión, salidas de aire y sistemas de difusión en aluminio para proyectos de climatización.",
  },
  smart_systems: {
    title: "Sistemas de Zonificación de Aire Acondicionado por Conductos | MYSAir",
    h1: "Sistemas de Zonificación de Aire Acondicionado por Conductos",
    description:
      "Sistemas de zonificación de aire acondicionado por conductos. Módulos de control, compuertas de regulación y termostatos para eficiencia energética.",
  },
  vmc: {
    title: "Sistemas de Ventilación Mecánica Controlada (VMC) | MYSAir",
    h1: "Sistemas de Ventilación Mecánica Controlada",
    description:
      "Sistemas VMC para garantizar la calidad del aire interior. Soluciones de ventilación eficientes para cumplir con la normativa en proyectos arquitectónicos.",
  },
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const categoria = typeof resolvedSearchParams.categoria === "string" ? resolvedSearchParams.categoria : undefined

  if (categoria && CATEGORY_SEO[categoria]) {
    const { title, description } = CATEGORY_SEO[categoria]
    return {
      title,
      description,
    }
  }

  return {
    title: "Productos | MYSAir",
    description:
      "Explora la gama completa de soluciones de climatización MYSAir: difusión de aire, zonificación inteligente y ventilación mecánica controlada.",
  }
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const categoria = typeof resolvedSearchParams.categoria === "string" ? resolvedSearchParams.categoria : undefined
  const seoData = categoria ? CATEGORY_SEO[categoria] : undefined

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsHeader category={categoria} />

        <ProductsClient initialCategory={categoria} />

        <SeoTextBlock categoria={categoria} />
      </div>

      <Footer />
    </main>
  )
}
