"use client"

import { useState, useEffect } from "react"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import { ProductCard } from "./product-card"
import { ProductsSearch } from "./products-search"

interface Product {
  id: number
  name: string
  description: string
  category: string
  subcategory: string
  price: number
  image_url: string[]
  technical_specs: any
  is_featured: boolean
  sort_order: number // Added sort_order field for manual ordering
  slug?: string // Made slug optional since column might not exist yet
  is_active?: boolean
}

interface FilterState {
  selectedCategories: string[]
  selectedSubcategories: string[]
  showFeatured: boolean
  showInactive: boolean
}

interface ProductsGridProps {
  filters: FilterState
}

export function ProductsGrid({ filters }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    async function fetchProducts() {
      try {
        console.log("[v0] Fetching products from database")
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("is_featured", { ascending: false })
          .order("name")

        if (error) throw error

        console.log("[v0] Products fetched:", data?.length || 0)

        setProducts(data || [])
        setFilteredProducts(data || [])
      } catch (err) {
        setError("Error al cargar los productos")
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (filters.selectedCategories.length > 0) {
      filtered = filtered.filter((product) => filters.selectedCategories.includes(product.category))
    }

    // Apply subcategory filter
    if (filters.selectedSubcategories.length > 0) {
      filtered = filtered.filter((product) => filters.selectedSubcategories.includes(product.subcategory))
    }

    // Apply featured filter
    if (filters.showFeatured) {
      filtered = filtered.filter((product) => product.is_featured)
    }

    // Apply inactive filter (hide by default, show if filters.showInactive is true)
    if (!filters.showInactive) {
      filtered = filtered.filter((product) => product.is_active !== false)
    }

    filtered = filtered.sort((a, b) => {
      // First sort by manual order
      if (a.sort_order !== b.sort_order) {
        return a.sort_order - b.sort_order
      }
      // Then by featured status
      if (a.is_featured !== b.is_featured) {
        return b.is_featured ? 1 : -1
      }
      // Finally by name
      return a.name.localeCompare(b.name)
    })

    setFilteredProducts(filtered)
  }, [searchTerm, products, filters])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-white rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-white rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ProductsSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">
            {searchTerm ? "No se encontraron productos que coincidan con tu búsqueda" : "No se encontraron productos"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
