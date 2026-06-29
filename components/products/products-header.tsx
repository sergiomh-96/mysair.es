"use client"

import { useI18n } from "@/lib/i18n-context"

interface ProductsHeaderProps {
  title?: string
  description?: string
  category?: string
}

export function ProductsHeader({ title, description }: ProductsHeaderProps = {}) {
  const { t } = useI18n()

  return (
    <div className="mb-8">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 ml-14 mt-9">
        {title || t("products.header.title")}
      </h1>
      <p className="text-xl text-gray-600 text-pretty px-14">
        {description || t("products.header.subtitle")}
      </p>
    </div>
  )
}
