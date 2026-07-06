"use client"

import { useI18n } from "@/lib/i18n-context"

interface ProductsHeaderProps {
  title?: string
  description?: string
  category?: string
}

export function ProductsHeader({ title, description, category }: ProductsHeaderProps = {}) {
  const { t } = useI18n()

  let displayTitle = title
  let displayDescription = description

  if (category) {
    const key = category.replace("-", "_")
    displayTitle = t(`products.categories.${key}.title`)
    displayDescription = t(`products.categories.${key}.description`)
  }

  return (
    <div className="mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 mt-9">
        {displayTitle || t("products.header.title")}
      </h1>
      <p className="text-xl text-gray-600 text-pretty">
        {displayDescription || t("products.header.subtitle")}
      </p>
    </div>
  )
}
