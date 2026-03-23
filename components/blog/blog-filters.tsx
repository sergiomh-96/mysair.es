"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Filter, X, Search, FileText, Newspaper, Award } from "lucide-react"

export function BlogFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const categories = [
    { id: "technical", name: "Técnico", icon: FileText },
    { id: "news", name: "Noticias", icon: Newspaper },
    { id: "case_study", name: "Casos de Éxito", icon: Award },
  ]

  const popularTags = [
    "climatización",
    "eficiencia",
    "domótica",
    "ahorro energético",
    "zonificación",
    "mantenimiento",
    "sostenibilidad",
    "IA",
  ]

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId])
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId))
    }
  }

  const handleTagChange = (tag: string, checked: boolean) => {
    if (checked) {
      setSelectedTags([...selectedTags, tag])
    } else {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    }
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedTags([])
    setSearchTerm("")
  }

  const hasActiveFilters = selectedCategories.length > 0 || selectedTags.length > 0 || searchTerm.length > 0

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
        {/* Search */}
        <div>
          <h3 className="font-semibold mb-3">Buscar</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

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

        {/* Popular Tags */}
        <div>
          <h3 className="font-semibold mb-3">Tags Populares</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <label key={tag} className="flex items-center">
                <Checkbox
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
                  className="sr-only"
                />
                <span
                  className={`px-3 py-1 text-xs rounded-full border cursor-pointer transition-colors ${
                    selectedTags.includes(tag)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-600"
                  }`}
                >
                  {tag}
                </span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
