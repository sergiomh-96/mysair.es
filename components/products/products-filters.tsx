"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Wind, Settings, Fan, Filter, X } from "lucide-react"

interface FilterState {
  selectedCategories: string[]
  selectedSubcategories: string[]
  showFeatured: boolean
}

interface ProductsFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ProductsFilters({ filters, onFiltersChange }: ProductsFiltersProps) {
  const { selectedCategories, selectedSubcategories, showFeatured } = filters

  const categories = [
    { id: "air_diffusion", name: "Difusión de Aire", icon: Wind },
    { id: "smart_systems", name: "Sistemas de zonas", icon: Settings },
    { id: "vmc", name: "VMC", icon: Fan },
  ]

  const subcategories = [
    { id: "grilles", name: "Rejillas", category: "air_diffusion" },
    { id: "diffusers", name: "Difusores", category: "air_diffusion" },
    { id: "nozzle", name: "Toberas y bocas", category: "air_diffusion" },
    { id: "dampers", name: "Compuertas", category: "air_diffusion" },
    { id: "plenums", name: "Plenums", category: "air_diffusion" },
    { id: "motor", name: "Motorizadas", category: "air_diffusion" },
    { id: "accesories", name: "Accesorios", category: "air_diffusion" },


    { id: "central", name: "Centralitas", category: "smart_systems" },
    { id: "gateway", name: "Pasarelas", category: "smart_systems" },
    { id: "controls", name: "Termostatos", category: "smart_systems" },
    { id: "comunication", name: "Módulos de Comunicación", category: "smart_systems" },
    { id: "accesories", name: "Accesorios", category: "smart_systems" },
    { id: "unizone", name: "Sistema 1zona", category: "smart_systems" },
    { id: "airkit", name: "Plenum Motorizado", category: "smart_systems" },
    { id: "mskit", name: "Cuadro Premontado", category: "smart_systems" },




    { id: "recovery", name: "Doble Flujo", category: "vmc" },
    { id: "accesories", name: "Accesorios", category: "vmc" },
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    let newCategories: string[]
    let newSubcategories = selectedSubcategories

    if (checked) {
      newCategories = [...selectedCategories, categoryId]
    } else {
      newCategories = selectedCategories.filter((id) => id !== categoryId)
      // Remove subcategories of this category
      const categorySubcategories = subcategories.filter((sub) => sub.category === categoryId).map((sub) => sub.id)
      newSubcategories = selectedSubcategories.filter((id) => !categorySubcategories.includes(id))
    }

    onFiltersChange({
      selectedCategories: newCategories,
      selectedSubcategories: newSubcategories,
      showFeatured,
    })
  }

  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    const newSubcategories = checked
      ? [...selectedSubcategories, subcategoryId]
      : selectedSubcategories.filter((id) => id !== subcategoryId)

    onFiltersChange({
      selectedCategories,
      selectedSubcategories: newSubcategories,
      showFeatured,
    })
  }

  const handleFeaturedChange = (checked: boolean) => {
    onFiltersChange({
      selectedCategories,
      selectedSubcategories,
      showFeatured: checked,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      selectedCategories: [],
      selectedSubcategories: [],
      showFeatured: false,
    })
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || showFeatured

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <h3 className="font-semibold mb-3">Categorías</h3>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                />
                <label htmlFor={category.id} className="flex items-center space-x-2 text-sm cursor-pointer">
                  <category.icon className="h-4 w-4 text-blue-600" />
                  <span>{category.name}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Subcategories */}
        {selectedCategories.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Subcategorías</h3>
            <div className="space-y-3">
              {subcategories
                .filter((sub) => selectedCategories.includes(sub.category))
                .map((subcategory) => (
                  <div key={subcategory.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={subcategory.id}
                      checked={selectedSubcategories.includes(subcategory.id)}
                      onCheckedChange={(checked) => handleSubcategoryChange(subcategory.id, checked as boolean)}
                    />
                    <label htmlFor={subcategory.id} className="text-sm cursor-pointer">
                      {subcategory.name}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Featured Products */}
        <div>
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" checked={showFeatured} onCheckedChange={handleFeaturedChange} />
            <label htmlFor="featured" className="text-sm cursor-pointer">
              Solo últimas novedades  
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
