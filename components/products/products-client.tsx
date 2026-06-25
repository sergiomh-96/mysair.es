"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { ProductsGrid } from "./products-grid"
import { ProductsFilters } from "./products-filters"

interface FilterState {
  selectedCategories: string[]
  selectedSubcategories: string[]
  showFeatured: boolean
  showInactive: boolean
}

interface ProductsClientProps {
  initialCategory?: string
}

export function ProductsClient({ initialCategory }: ProductsClientProps) {
  const searchParams = useSearchParams()
  const prevCategoryRef = useRef<string | null>(initialCategory || null)

  const [filters, setFilters] = useState<FilterState>(() => {
    const categoria = searchParams.get("categoria") || initialCategory
    return {
      selectedCategories: categoria ? [categoria] : [],
      selectedSubcategories: [],
      showFeatured: false,
      showInactive: false,
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
  )
}
