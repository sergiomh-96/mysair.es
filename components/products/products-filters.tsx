"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Wind, Settings, Fan, Filter, X } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

interface FilterState {
  selectedCategories: string[]
  selectedSubcategories: string[]
  showFeatured: boolean
  showInactive: boolean
}

interface ProductsFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ProductsFilters({ filters, onFiltersChange }: ProductsFiltersProps) {
  const { t } = useI18n()
  const { selectedCategories, selectedSubcategories, showFeatured, showInactive } = filters

  const categories = [
    { id: "air_diffusion", name: t("products.detail.cat_air"), icon: Wind },
    { id: "smart_systems", name: t("products.detail.cat_smart"), icon: Settings },
    { id: "vmc", name: t("products.filters.cat_vmc"), icon: Fan },
  ]

  const subcategories = [
    { id: "grilles", name: t("products.filters.sub_grilles"), category: "air_diffusion" },
    { id: "diffusers", name: t("products.filters.sub_diffusers"), category: "air_diffusion" },
    { id: "nozzle", name: t("products.filters.sub_nozzle"), category: "air_diffusion" },
    { id: "dampers", name: t("products.filters.sub_dampers"), category: "air_diffusion" },
    { id: "plenums", name: t("products.filters.sub_plenums"), category: "air_diffusion" },
    { id: "motor", name: t("products.filters.sub_motor"), category: "air_diffusion" },
    { id: "accessories", name: t("products.filters.sub_accessories"), category: "air_diffusion" },

    { id: "central", name: t("products.filters.sub_central"), category: "smart_systems" },
    { id: "gateway", name: t("products.filters.sub_gateway"), category: "smart_systems" },
    { id: "controls", name: t("products.filters.sub_controls"), category: "smart_systems" },
    { id: "communication", name: t("products.filters.sub_communication"), category: "smart_systems" },
    { id: "accessories", name: t("products.filters.sub_accessories"), category: "smart_systems" },
    { id: "unizone", name: t("products.filters.sub_unizone"), category: "smart_systems" },
    { id: "airkit", name: t("products.filters.sub_airkit"), category: "smart_systems" },
    { id: "mskit", name: t("products.filters.sub_mskit"), category: "smart_systems" },

    { id: "recovery", name: t("products.filters.sub_recovery"), category: "vmc" },
    { id: "accessories", name: t("products.filters.sub_accessories"), category: "vmc" },
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
      showInactive,
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
      showInactive,
    })
  }

  const handleFeaturedChange = (checked: boolean) => {
    onFiltersChange({
      selectedCategories,
      selectedSubcategories,
      showFeatured: checked,
      showInactive,
    })
  }

  const handleInactiveChange = (checked: boolean) => {
    onFiltersChange({
      selectedCategories,
      selectedSubcategories,
      showFeatured,
      showInactive: checked,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      selectedCategories: [],
      selectedSubcategories: [],
      showFeatured: false,
      showInactive: false,
    })
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || showFeatured || showInactive

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            {t("products.filters.title")}
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
          <h3 className="font-semibold mb-3">{t("products.filters.categories")}</h3>
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
            <h3 className="font-semibold mb-3">{t("products.filters.subcategories")}</h3>
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
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="featured" checked={showFeatured} onCheckedChange={handleFeaturedChange} />
            <label htmlFor="featured" className="text-sm cursor-pointer">
              {t("products.filters.featured")}
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="inactive" checked={showInactive} onCheckedChange={handleInactiveChange} />
            <label htmlFor="inactive" className="text-sm cursor-pointer">
              {t("products.filters.show_discontinued")}
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
