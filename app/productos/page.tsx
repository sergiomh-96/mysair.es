"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ProductsGrid } from "@/components/products/products-grid"
import { ProductsFilters } from "@/components/products/products-filters"
import { ProductsHeader } from "@/components/products/products-header"

interface FilterState {
  selectedCategories: string[]
  selectedSubcategories: string[]
  showFeatured: boolean
}

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const prevCategoryRef = useRef<string | null>(null)

  const [filters, setFilters] = useState<FilterState>(() => {
    const categoria = searchParams.get("categoria")
    return {
      selectedCategories: categoria ? [categoria] : [],
      selectedSubcategories: [],
      showFeatured: false,
    }
  })

  useEffect(() => {
    const categoria = searchParams.get("categoria")
    if (categoria !== prevCategoryRef.current) {
      prevCategoryRef.current = categoria
      setFilters((prevFilters) => ({
        ...prevFilters,
        selectedCategories: categoria ? [categoria] : [],
        selectedSubcategories: [], // Reset subcategories when category changes
      }))
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductsHeader />

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductsFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <ProductsGrid filters={filters} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
