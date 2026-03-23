"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ProductsSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function ProductsSearch({ searchTerm, onSearchChange }: ProductsSearchProps) {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        placeholder="Buscar productos por nombre o descripción..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )
}
