"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, Settings, Star } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

interface Product {
  id: number
  name: string
  description: string
  category: string
  subcategory: string
  price: number
  image_url: string | string[] // Updated to support both string and array
  technical_specs: any
  is_featured: boolean
  sort_order: number // Added sort_order field for manual ordering
  slug?: string // Made slug optional since column might not exist yet
  is_active?: boolean
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useI18n()

  const getFirstImage = (imageUrl: string | string[]) => {
    if (Array.isArray(imageUrl)) {
      return imageUrl[0] || "/placeholder.svg?height=200&width=300"
    }
    return imageUrl || "/placeholder.svg?height=200&width=300"
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "air_diffusion":
        return Wind
      case "smart_systems":
        return Settings
      default:
        return Wind
    }
  }

  const getCategoryName = (category: string) => {
    switch (category) {
      case "air_diffusion":
        return t("products.detail.cat_air")
      case "smart_systems":
        return t("products.detail.cat_smart")
      case "vmc":
        return t("products.filters.cat_vmc")
      default:
        return category
    }
  }

  const getSubcategoryName = (subcategory: string) => {
    const names: Record<string, string> = {
      grilles: t("products.filters.sub_grilles"),
      diffusers: t("products.filters.sub_diffusers"),
      dampers: t("products.filters.sub_dampers"),
      nozzle: t("products.filters.sub_nozzle"),
      plenums: t("products.filters.sub_plenums"),
      motor: t("products.filters.sub_motor"),
      central: t("products.filters.sub_central"),
      gateway: t("products.filters.sub_gateway"),
      controls: t("products.filters.sub_controls"),
      comunication: t("products.filters.sub_communication"),
      unizone: t("products.filters.sub_unizone"),
      accessories: t("products.filters.sub_accessories"),
      recovery: t("products.filters.sub_recovery"),
    }
    return names[subcategory] || subcategory
  }

  const CategoryIcon = getCategoryIcon(product.category)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/[ñ]/g, "n")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  const productSlug = product.slug || generateSlug(product.name)

  return (
    <Link href={`/productos/${productSlug}`} className="block group">
      <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer relative">
        {product.is_featured && (
          <Badge className="absolute top-2 left-2 z-10 bg-blue-600 text-xs">
            <Star className="h-2 w-2 mr-1" />
            {t("products.detail.featured")}
          </Badge>
        )}
        {product.is_active === false && (
          <Badge variant="destructive" className="absolute top-2 right-2 z-10 text-xs">
            {t("products.detail.discontinued")}
          </Badge>
        )}
        <div className="w-48 h-48 bg-gray-100 overflow-hidden mx-auto">
          <img
            src={getFirstImage(product.image_url) || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <CardContent className="pt-1 px-2 pb-2">
          <div className="flex items-center gap-2 mb-1">
            <CategoryIcon className="h-4 w-4 text-blue-600" />
            <Badge variant="secondary" className="text-xs">
              {getSubcategoryName(product.subcategory)}
            </Badge>
          </div>
          <h3 className="font-semibold text-base mb-1 text-balance text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs mb-2 text-pretty line-clamp-2">{product.description}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
