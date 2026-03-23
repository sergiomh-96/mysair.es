import { createServerSupabaseClient } from "@/lib/supabase/server"
import { ProductCard } from "./product-card"

interface CategoryProductsGridProps {
  category: string
}

export async function CategoryProductsGrid({ category }: CategoryProductsGridProps) {
  const supabase = await createServerSupabaseClient()

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category", category)
    .order("sort_order", { ascending: true })
    .order("is_featured", { ascending: false })
    .order("name")

  if (error) {
    console.error("Error fetching products:", error)
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Error al cargar los productos</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No se encontraron productos en esta categoría</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
