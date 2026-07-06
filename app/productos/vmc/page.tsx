"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { ProductsHeader } from "@/components/products/products-header"
import { ProductsFilters } from "@/components/products/products-filters"
import { ProductsGrid } from "@/components/products/products-grid"

interface FilterState {
  selectedCategories: string[]
  selectedSubcategories: string[]
  showFeatured: boolean
  showInactive: boolean
}

export default function VMCProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    selectedCategories: ["vmc"],
    selectedSubcategories: [],
    showFeatured: false,
    showInactive: false,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ProductsHeader category="vmc" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64">
            <ProductsFilters filters={filters} onFiltersChange={setFilters} />
          </aside>
          <main className="flex-1">
            <ProductsGrid filters={filters} />
          </main>
        </div>
      </div>
    </div>
  )
}
